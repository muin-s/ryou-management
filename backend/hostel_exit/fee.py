def calculate_fee(leave_dt, return_dt, room_type):
    if not leave_dt or not return_dt:
        return 0

    total_days = (return_dt.date() - leave_dt.date()).days

    # Rule:
    # Same day or 1 day → NO CHARGE
    if total_days <= 1:
        return 0

    chargeable_days = total_days - 1

    if room_type == "2_seater":
        per_day = 300
    else:
        per_day = 200

    return chargeable_days * per_day
