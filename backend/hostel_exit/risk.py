def assess_risk(leave_dt, return_dt, emergency_contact):
    if not emergency_contact:
        return "high"

    if leave_dt and return_dt:
        days = (return_dt - leave_dt).days
        if days >= 30:
            return "high"
        if days >= 7:
            return "medium"

    return "low"
