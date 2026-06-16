from app.db.session import SessionLocal
from app.models.management_company import ManagementCompany
from app.models.site import Site
from app.models.user import User

def main() -> None: 
    db = SessionLocal()

    try: 
        company = (
            db.query(ManagementCompany)
            .filter(ManagementCompany.name == "Frasers")
            .first()
        )

        if company is None: 
            print("Company not found.")
            return 
        
        print(f"Company: {company.name}")
        print(f"Users count: {len(company.users)}")
        print(f"Sites count: {len(company.sites)}")

        print("\nUsers in company:")
        for user in company.users:
            print(f"- {user.full_name} | {user.email} | role={user.role}")

        print("\nSites in company:")
        for site in company.sites:
            print(f"- {site.name} | code={site.code}")

        company_user = (
            db.query(User)
            .filter(User.email == "frasers.user@example.com")
            .first()
        )

        if company_user is not None:
            print("\nCompany user -> management company:")
            print(f"{company_user.full_name} belongs to {company_user.management_company.name}")

        admin_user = (
            db.query(User)
            .filter(User.email == "admin@treescapes.com")
            .first()
        )

        if admin_user is not None:
            print("\nAdmin user company link:")
            print(admin_user.management_company)

        site = (
            db.query(Site)
            .filter(Site.code == "FRS-001")
            .first()
        )

        if site is not None:
            print("\nSite -> management company:")
            print(f"{site.name} belongs to {site.management_company.name}")

    finally:
        db.close()


if __name__ == "__main__":
    main()