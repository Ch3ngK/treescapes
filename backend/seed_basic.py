from passlib.context import CryptContext

from app.db.session import SessionLocal
from app.models.management_company import ManagementCompany
from app.models.site import Site
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def main() -> None:
    db = SessionLocal()

    try:
        existing_company = (
            db.query(ManagementCompany)
            .filter(ManagementCompany.name == "Frasers")
            .first()
        )

        if existing_company:
            print("Frasers already exists. Seed skipped.")
            return

        company = ManagementCompany(name="Frasers")
        db.add(company)
        db.flush()

        admin_user = User(
            email="admin@treescapes.com",
            hashed_password=hash_password("Admin123!"),
            full_name="Treescapes Admin",
            role="treescapes_admin",
            management_company_id=None,
        )

        company_user = User(
            email="frasers.user@example.com",
            hashed_password=hash_password("User123!"),
            full_name="Frasers Evaluator",
            role="company_user",
            management_company_id=company.id,
        )

        site = Site(
            name="Frasers Demo Site",
            code="FRS-001",
            address="123 Demo Road",
            management_company_id=company.id,
        )

        db.add_all([admin_user, company_user, site])
        db.commit()

        print("Seed complete.")
        print(f"Company ID: {company.id}")
        print(f"Company user company_id: {company_user.management_company_id}")
        print(f"Site company_id: {site.management_company_id}")

    finally:
        db.close()


if __name__ == "__main__":
    main()