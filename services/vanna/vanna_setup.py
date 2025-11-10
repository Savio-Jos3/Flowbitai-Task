import os
from dotenv import load_dotenv
from urllib.parse import urlparse
import psycopg2
import pandas as pd
from groq import Groq

load_dotenv()

class VannaService:
    """Custom Vanna-like service using Groq for SQL generation"""
    
    def __init__(self):
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found")
        
        self.groq_client = Groq(api_key=groq_api_key)
        
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            raise ValueError("DATABASE_URL not found")
        
        parsed = urlparse(db_url)
        self.db_config = {
            'host': parsed.hostname,
            'database': parsed.path.lstrip('/'),
            'user': parsed.username,
            'password': parsed.password,
            'port': parsed.port or 5432
        }
        
        self.schema_info = self._get_schema_info()
        
        print(f"✅ Connected to database: {self.db_config['database']}")
        print(f"✅ Found tables: {', '.join(self.schema_info.keys())}")
        print("✅ Vanna AI ready with Groq!")
    
    def _get_schema_info(self):
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
            schema = {}
            for table in tables:
                cursor.execute(f"""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' 
                    AND table_schema = 'public'
                    ORDER BY ordinal_position;
                """)
                schema[table] = [f'"{col[0]}" ({col[1]})' for col in cursor.fetchall()]
            
            cursor.close()
            conn.close()
            return schema
            
        except Exception as e:
            print(f"Warning: {str(e)}")
            return {}
    
    def _build_context(self):
        context = "PostgreSQL Database Schema:\n\n"
        
        for table, columns in self.schema_info.items():
            context += f'Table: "{table}"\n'
            context += "Columns:\n"
            for col in columns:
                context += f"  - {col}\n"
            context += "\n"
        
        context += "Rules:\n1. Use double quotes for names\n2. Return only SQL\n"
        return context
    
    def generate_sql(self, question: str) -> str:
        system_context = self._build_context()
    
        prompt = f"""{system_context}

    User Question: {question}

    Generate PostgreSQL query. Return ONLY the SQL."""

        try:
            response = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # ← CHANGED FROM llama3-70b-8192
                messages=[
                    {"role": "system", "content": "You are a PostgreSQL expert. Return only SQL queries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            sql = response.choices[0].message.content.strip()
            
            # Remove markdown
            if sql.count('`') >= 6:
                parts = sql.split('`')
                sql = parts[3] if len(parts) > 3 else sql
                if sql.lower().startswith('sql'):
                    sql = sql[3:]
            
            return sql.strip()
            
        except Exception as e:
            raise Exception(f"SQL generation failed: {str(e)}")
    
    def run_sql(self, sql: str) -> pd.DataFrame:
        try:
            conn = psycopg2.connect(**self.db_config)
            df = pd.read_sql_query(sql, conn)
            conn.close()
            return df
        except Exception as e:
            raise Exception(f"SQL execution failed: {str(e)}")
    
    def ask(self, question: str):
        try:
            print(f"\n🤔 Question: {question}")
            
            sql = self.generate_sql(question)
            print(f"🔍 SQL:\n{sql}")
            
            if not sql:
                return {
                    "success": False,
                    "error": "Could not generate SQL",
                    "question": question
                }
            
            df = self.run_sql(sql)
            results = df.to_dict('records')
            
            print(f"✅ Success: {len(results)} rows\n")
            
            return {
                "success": True,
                "question": question,
                "sql": sql,
                "results": results,
                "row_count": len(results)
            }
            
        except Exception as e:
            print(f"❌ Error: {str(e)}\n")
            return {
                "success": False,
                "error": str(e),
                "question": question
            }

print("🚀 Initializing Vanna Service...")
vanna_service = VannaService()
