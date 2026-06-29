from app.db.session import SessionLocal
from app.models.checklist_item import ChecklistItem
from app.models.checklist_section import ChecklistSection
from app.models.checklist_template import ChecklistTemplate


TEMPLATE_NAME = "Treescapes Landscape Performance Checklist"
TEMPLATE_VERSION = "2026-05"

SECTION_DATA = [
    {"code": "A", "title": "Safe & Pleasant Environment", "max_points": 19, "display_order": 1},
    {"code": "B", "title": "Safety & Property", "max_points": 6, "display_order": 2},
    {"code": "C", "title": "Responsiveness", "max_points": 9, "display_order": 3},
    {"code": "D", "title": "Reports", "max_points": 2, "display_order": 4},
    {"code": "E", "title": "Staff Competency", "max_points": 11, "display_order": 5},
    {"code": "F", "title": "Statutory Compliance", "max_points": 10, "display_order": 6},
]

ITEM_DATA = [
    {
        "section_code": "A",
        "code": "A1",
        "description": "Length of grass is no longer than 5cm at all times.",
        "max_points": 1,
        "display_order": 1,
    },
    {
        "section_code": "A",
        "code": "A2",
        "description": (
            "Tree branches / shrubs are not blocking any important signage or "
            "passageways at all times."
        ),
        "max_points": 3,
        "display_order": 2,
    },
    {
        "section_code": "A",
        "code": "A3",
        "description": "No signs of weeds around greenery at all times.",
        "max_points": 1,
        "display_order": 3,
    },
    {
        "section_code": "A",
        "code": "A4",
        "description": "No signs of infection or wilting of greenery / potted plants always.",
        "max_points": 1,
        "display_order": 4,
    },
    {
        "section_code": "A",
        "code": "A5",
        "description": (
            "No landscape showing signs of bald turf, patches, pot holes, ground "
            "depressions, erosion and hardscape showing visible stains."
        ),
        "max_points": 1,
        "display_order": 5,
    },
    {
        "section_code": "A",
        "code": "A6",
        "description": "No landscape showing signs of pest and disease infection.",
        "max_points": 1,
        "display_order": 6,
    },
    {
        "section_code": "A",
        "code": "A7",
        "description": (
            "Fallen/hanging branches, landscape debris and leaves that are not "
            "disposed from site and / or causing chokage to drain/pipes etc. are "
            "not more than 3 occasions. 0 - 1 occasion = 3 points, 2 occasions = "
            "2 points, 3 occasions = 1 point, more than 3 occasions = 0 point."
        ),
        "max_points": 3,
        "display_order": 7,
    },
    {
        "section_code": "A",
        "code": "A8",
        "description": (
            "Where contractor fails to meet the supply / change of the type of "
            "potted plants in accordance to contract provision."
        ),
        "max_points": 2,
        "display_order": 8,
    },
    {
        "section_code": "A",
        "code": "A9",
        "description": "Rental plants presentable.",
        "max_points": 2,
        "display_order": 9,
    },
    {
        "section_code": "A",
        "code": "A10",
        "description": (
            "Puddles of water due to soil depression not filled is not more than "
            "2 occasions monthly. 0 - 1 occasion = 2 points, 2 occasions = 1 "
            "point, more than 2 occasions = 0 point."
        ),
        "max_points": 2,
        "display_order": 10,
    },
    {
        "section_code": "A",
        "code": "A11",
        "description": "No sign of water wastage in the course of maintenance work.",
        "max_points": 2,
        "display_order": 11,
    },
    {
        "section_code": "B",
        "code": "B1",
        "description": (
            "Total number of non-compliance incidents relating to operational "
            "& safety procedures each month not more than 1 occasion monthly."
        ),
        "max_points": 2,
        "display_order": 1,
    },
    {
        "section_code": "B",
        "code": "B2",
        "description": (
            "Total number of non-compliance incidents relating to damage of "
            "property each month not more than 1 occasion monthly. 0 - 1 "
            "occasion = 2 points, more than 1 occasion = 0 point."
        ),
        "max_points": 2,
        "display_order": 2,
    },
    {
        "section_code": "B",
        "code": "B3",
        "description": (
            "Total number of incidents where reporting procedures were not "
            "followed each month not more than 2 occasions monthly. 0 - 1 "
            "occasion = 2 points, 2 occasions = 1 point, more than 2 occasions "
            "= 0 point."
        ),
        "max_points": 2,
        "display_order": 3,
    },
    {
        "section_code": "C",
        "code": "C1",
        "description": (
            "Total number of incidents where the time taken for a request to be "
            "picked up exceed 15 minutes is not more than 2 occasions monthly."
        ),
        "max_points": 2,
        "display_order": 1,
    },
    {
        "section_code": "C",
        "code": "C2",
        "description": (
            "Total number of failures to attend to urgent gardening/landscaping "
            "job within 24 hours upon receipt of instruction from the Client is "
            "not more than 2 occasions monthly. 0 - 1 occasion = 2 points, 2 "
            "occasions = 1 point, more than 2 occasions = 0 point."
        ),
        "max_points": 2,
        "display_order": 2,
    },
    {
        "section_code": "C",
        "code": "C3",
        "description": (
            "Failure to attend to emergency request within 2 hours upon receipt "
            "of instruction from the Client is not more than 1 occasion monthly. "
            "0 - 1 occasion = 4 points, more than 1 occasion = 0 point."
        ),
        "max_points": 4,
        "display_order": 3,
    },
    {
        "section_code": "C",
        "code": "C4",
        "description": (
            "Contractor completes the minor landscape enhancement / improvement "
            "works in accordance to the agreed schedule / timeline."
        ),
        "max_points": 1,
        "display_order": 4,
    },
    {
        "section_code": "D",
        "code": "D1",
        "description": (
            "Failure to submit timely reports, checklists and incident reports "
            "each month is not more than 2 occasions monthly."
        ),
        "max_points": 2,
        "display_order": 1,
    },
    {
        "section_code": "E",
        "code": "E1",
        "description": "Total number of complaints is not more than 3 occasions monthly.",
        "max_points": 3,
        "display_order": 1,
    },
    {
        "section_code": "E",
        "code": "E2",
        "description": (
            "Incidents for bad attitude (eg. Falsifying attendance sheets, "
            "sleeping during working hours, smoking, quarrelling, drinking beer "
            "or alcoholic beverages, rude or disturbing Client / tenants / "
            "shoppers / public when on duty)."
        ),
        "max_points": 2,
        "display_order": 2,
    },
    {
        "section_code": "E",
        "code": "E3",
        "description": (
            "Provide approved and certified horticulturists, arborists, or other "
            "qualified personnel as stipulated in the contract."
        ),
        "max_points": 2,
        "display_order": 3,
    },
    {
        "section_code": "E",
        "code": "E4",
        "description": (
            "Provide appropriate/approved chemical, material, machinery, tools "
            "and equipment for landscaping works at Client's premise."
        ),
        "max_points": 2,
        "display_order": 4,
    },
    {
        "section_code": "E",
        "code": "E5",
        "description": (
            "Complying with the Client's instruction or performance to the "
            "Client's satisfaction."
        ),
        "max_points": 2,
        "display_order": 5,
    },
    {
        "section_code": "F",
        "code": "F1",
        "description": (
            "Complying with the statutory regulations (MOM, NParks, NEA etc.) "
            "0 occasion = 10 points, 1 or more occasions = 0 points."
        ),
        "max_points": 10,
        "display_order": 1,
    },
]


def main() -> None:
    db = SessionLocal()

    try:
        template = (
            db.query(ChecklistTemplate)
            .filter(
                ChecklistTemplate.name == TEMPLATE_NAME,
                ChecklistTemplate.version == TEMPLATE_VERSION,
            )
            .first()
        )

        if template is None:
            template = ChecklistTemplate(
                name=TEMPLATE_NAME,
                description="Seeded from the Frasers Tower performance checklist PDF.",
                version=TEMPLATE_VERSION,
                is_active=True,
            )
            db.add(template)
            db.flush()
        else:
            template.description = "Seeded from the Frasers Tower performance checklist PDF."
            template.is_active = True

        sections_by_code: dict[str, ChecklistSection] = {}

        for section_data in SECTION_DATA:
            section = (
                db.query(ChecklistSection)
                .filter(
                    ChecklistSection.template_id == template.id,
                    ChecklistSection.code == section_data["code"],
                )
                .first()
            )

            if section is None:
                section = ChecklistSection(
                    template_id=template.id,
                    code=section_data["code"],
                    title=section_data["title"],
                    max_points=section_data["max_points"],
                    display_order=section_data["display_order"],
                )
                db.add(section)
                db.flush()
            else:
                section.title = section_data["title"]
                section.max_points = section_data["max_points"]
                section.display_order = section_data["display_order"]

            sections_by_code[section.code] = section

        for item_data in ITEM_DATA:
            section = sections_by_code[item_data["section_code"]]

            existing_item = (
                db.query(ChecklistItem)
                .filter(
                    ChecklistItem.section_id == section.id,
                    ChecklistItem.code == item_data["code"],
                )
                .first()
            )

            if existing_item is None:
                item = ChecklistItem(
                    section_id=section.id,
                    code=item_data["code"],
                    description=item_data["description"],
                    max_points=item_data["max_points"],
                    display_order=item_data["display_order"],
                    is_active=True,
                )
                db.add(item)
            else:
                existing_item.description = item_data["description"]
                existing_item.max_points = item_data["max_points"]
                existing_item.display_order = item_data["display_order"]
                existing_item.is_active = True

        db.commit()

        print("Checklist seed complete.")
        print(f"Template: {template.name} ({template.version})")
        print(f"Sections ensured: {len(SECTION_DATA)}")
        print(f"Items ensured: {len(ITEM_DATA)}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
