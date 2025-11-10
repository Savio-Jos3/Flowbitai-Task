import os
from vanna.remote import VannaDefault
from dotenv import load_dotenv

load_dotenv()

class VannaService:
    def __init__(self):
        self.vn = VannaDefault(
            model='groq/llama3-70b-8192',
            api_key=os.getenv('GROQ_API_KEY')
        )
        
        # Connect to PostgreSQL
        db_url = os.getenv('DATABASE_URL')
        self.vn.connect_to_postgres(
            host=self._parse_db_host(db_url),
            dbname=self._parse_db_name(db_url),
            user=self._parse_db_user(db_url),
            password=self._parse_db_password(db_url),
            port=self._parse_db_port(db_url)
        )
        
        # Train Vanna on your schema
        self.train_vanna()
    
    def _parse_db_host(self, url):
        # Parse postgresql+psycopg://user:pass@host:port/dbname
        return url.split('@')[1].split(':')[0]
    
    def _parse_db_name(self, url):
        return url.split('/')[-1]
    
    def _parse_db_user(self, url):
        return url.split('//')[1].split(':')[0]
    
    def _parse_db_password(self, url):
        return url.split(':')[2].split('@')[0]
    
    def _parse_db_port(self, url):
        return int(url.split(':')[-1].split('/')[0])
    
    def train_vanna(self):
        """Train Vanna with your database schema"""
        
        # Add DDL statements for training
        ddl_statements = [
            """
            CREATE TABLE "Invoice" (
                id TEXT PRIMARY KEY,
                invoiceNumber TEXT NOT NULL,
                vendorId TEXT NOT NULL,
                customerId TEXT NOT NULL,
                invoiceDate TIMESTAMP,
                deliveryDate TIMESTAMP,
                invoiceTotal DECIMAL,
                status TEXT,
                documentId TEXT,
                FOREIGN KEY (vendorId) REFERENCES "Vendor"(id),
                FOREIGN KEY (customerId) REFERENCES "Customer"(id)
            );
            """,
            """
            CREATE TABLE "Vendor" (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                taxId TEXT,
                address TEXT,
                email TEXT,
                partyNumber TEXT
            );
            """,
            """
            CREATE TABLE "Customer" (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                address TEXT,
                email TEXT
            );
            """,
            """
            CREATE TABLE "LineItem" (
                id TEXT PRIMARY KEY,
                invoiceId TEXT NOT NULL,
                description TEXT,
                quantity DECIMAL,
                unitPrice DECIMAL,
                totalPrice DECIMAL,
                sachkonto TEXT,
                buschluessel TEXT,
                FOREIGN KEY (invoiceId) REFERENCES "Invoice"(id)
            );
            """,
            """
            CREATE TABLE "Payment" (
                id TEXT PRIMARY KEY,
                invoiceId TEXT NOT NULL,
                paymentDate TIMESTAMP,
                amount DECIMAL,
                bankAccount TEXT,
                bic TEXT,
                paymentTerms TEXT,
                FOREIGN KEY (invoiceId) REFERENCES "Invoice"(id)
            );
            """
        ]
        
        for ddl in ddl_statements:
            self.vn.train(ddl=ddl)
        
        # Add example questions for better context
        examples = [
            {
                "question": "What is the total spend in the last 90 days?",
                "sql": """
                SELECT SUM("invoiceTotal") as total_spend
                FROM "Invoice"
                WHERE "invoiceDate" >= NOW() - INTERVAL '90 days';
                """
            },
            {
                "question": "List top 5 vendors by spend",
                "sql": """
                SELECT v.name, SUM(i."invoiceTotal") as total_spend
                FROM "Invoice" i
                JOIN "Vendor" v ON i."vendorId" = v.id
                GROUP BY v.name
                ORDER BY total_spend DESC
                LIMIT 5;
                """
            },
            {
                "question": "Show overdue invoices",
                "sql": """
                SELECT i."invoiceNumber", v.name as vendor, i."invoiceDate", i."invoiceTotal"
                FROM "Invoice" i
                JOIN "Vendor" v ON i."vendorId" = v.id
                WHERE i.status != 'paid' AND i."deliveryDate" < NOW();
                """
            }
        ]
        
        for example in examples:
            self.vn.train(question=example['question'], sql=example['sql'])
        
        print("✅ Vanna training completed!")
    
    def ask(self, question: str):
        """Ask Vanna a question"""
        try:
            # Generate SQL
            sql = self.vn.generate_sql(question)
            
            # Execute SQL
            df = self.vn.run_sql(sql)
            
            # Convert DataFrame to dict
            results = df.to_dict('records')
            
            return {
                "success": True,
                "question": question,
                "sql": sql,
                "results": results,
                "row_count": len(results)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "question": question
            }

# Create singleton instance
vanna_service = VannaService()
