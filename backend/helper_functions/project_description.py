def clean_text(value):
    """Removes unwanted trailing characters from categorical values."""
    if isinstance(value, str):
        return value.strip().strip(";").strip(".")  # Removes trailing semicolons and periods
    return value

def create_project_description(row, present_effort=True, present_sprints=True, test_project=False):
    tense_map = {
        "was": "is going to be" if test_project else "was",
        "developed": "will be developed" if test_project else "was developed",
        "falls": "will fall" if test_project else "falls",
        "followed": "will follow" if test_project else "followed",
        "utilizing": "will utilize" if test_project else "utilizing",
        "completed": "will be completed" if test_project else "was completed",
        "involved": "will involve" if test_project else "involved",
        "added": "will be added" if test_project else "were added",
        "reached": "will reach" if test_project else "reached",
    }

    description = (
        f"A {clean_text(row.get('Industry Sector', ''))} industry project {tense_map['developed']} by a "
        f"{clean_text(row.get('Organisation Type', ''))} organization. The project {tense_map['falls']} under the '{clean_text(row.get('Application Group', ''))}' category, "
        f"specifically as a '{clean_text(row.get('Application Type', ''))}' application. It {tense_map['was']} an {clean_text(row.get('Development Type', ''))} project, "
        f"{tense_map['developed']} on a {clean_text(row.get('Development Platform', ''))} platform using {clean_text(row.get('Primary Programming Language', ''))} as the primary programming language.\n\n"
        
        f"The functional size of the project {tense_map['was']} {row.get('Functional Size', 'N/A')} function points, with an adjusted function size of "
        f"{row.get('Adjusted Function Points', 'N/A')} function points."
    )

    if present_effort:
        description += f" The normalized work effort for the project {tense_map['was']} {row.get('Normalised Work Effort', 'N/A')} person-hours.\n\n"
    else:
        description += "\n\n"

    description += (
        f"The scope of activities includes {clean_text(row.get('Project Activity Scope', '')).replace(';', ', ')}. The maximum team size {tense_map['reached']} "
        f"{round(row.get('Max Team Size', 0) or 0)} members. The project {tense_map['followed']} the {clean_text(row.get('Development Methodologies', ''))} methodology, "
        f"{tense_map['utilizing']} development techniques such as {clean_text(row.get('Development Techniques', '')).replace(';', ', ')}.\n\n"
    )

    if present_sprints:
        description += f"The project {tense_map['completed']} in {int(row.get('Sprints / iterations', 0))} sprint(s). "
    
    description += (
        f"It {tense_map['involved']} {round(row.get('Input count', 0) or 0)} input count, {round(row.get('Output count', 0) or 0)} output count, "
        f"{round(row.get('Enquiry count', 0) or 0)} enquiry count, {round(row.get('File count', 0) or 0)} file count, and "
        f"{round(row.get('Interface count', 0) or 0)} interface count. A total of {round(row.get('Added count', 0) or 0)} new elements {tense_map['added']} to the system (added count)."
    )

    return description
