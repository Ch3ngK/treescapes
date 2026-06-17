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
        frasers = (
            db.query(ManagementCompany)
            .filter(ManagementCompany.name == "Frasers")
            .first()
        )

        if frasers is None:
            frasers = ManagementCompany(name="Frasers")
            db.add(frasers)
            db.flush()

        company_b = (
            db.query(ManagementCompany)
            .filter(ManagementCompany.name == "Company B")
            .first()
        )

        if company_b is None:
            company_b = ManagementCompany(name="Company B")
            db.add(company_b)
            db.flush()

        admin_user = db.query(User).filter(User.email == "admin@treescapes.com").first()

        if admin_user is None:
            admin_user = User(
                email="admin@treescapes.com",
                hashed_password=hash_password("Admin123!"),
                full_name="Treescapes Admin",
                role="treescapes_admin",
                management_company_id=None,
            )
            db.add(admin_user)

        frasers_user = (
            db.query(User)
            .filter(User.email == "frasers.user@example.com")
            .first()
        )

        if frasers_user is None:
            frasers_user = User(
                email="frasers.user@example.com",
                hashed_password=hash_password("User123!"),
                full_name="Frasers Evaluator",
                role="company_user",
                management_company_id=frasers.id,
            )
            db.add(frasers_user)

        company_b_user = (
            db.query(User)
            .filter(User.email == "companyb.user@example.com")
            .first()
        )

        if company_b_user is None:
            company_b_user = User(
                email="companyb.user@example.com",
                hashed_password=hash_password("User123!"),
                full_name="Company B Evaluator",
                role="company_user",
                management_company_id=company_b.id,
            )
            db.add(company_b_user)

        frasers_site = db.query(Site).filter(Site.code == "FRS-001").first()

        if frasers_site is None:
            frasers_site = Site(
                name="Frasers Demo Site",
                code="FRS-001",
                address="123 Demo Road",
                management_company_id=frasers.id,
            )
            db.add(frasers_site)

        company_b_site = db.query(Site).filter(Site.code == "CPB-001").first()

        if company_b_site is None:
            company_b_site = Site(
                name="Company B Demo Site",
                code="CPB-001",
                address="456 Company B Road",
                management_company_id=company_b.id,
            )
            db.add(company_b_site)

        db.commit()

        print("Seed complete.")
        print(f"Frasers ID: {frasers.id}")
        print(f"Company B ID: {company_b.id}")

    finally:
        db.close()


if __name__ == "__main__":
    main()