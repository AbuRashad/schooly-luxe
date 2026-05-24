"""
Schooly Luxe – Premium School Management Dashboard
Streamlit MVP with in-memory demo data.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta
from typing import Any

import pandas as pd
import streamlit as st

# ---------------------------------------------------------------------------
# Page config (must be first Streamlit call)
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="Schooly Luxe",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------------------------
# Demo credentials
# ---------------------------------------------------------------------------
DEMO_USERS: dict[str, dict[str, str]] = {
    "admin@schoolyluxe.com": {
        "password": "Admin@12345",
        "name": "Platform Admin",
        "role": "ADMIN",
    },
    "teacher@schoolyluxe.com": {
        "password": "Teacher@12345",
        "name": "Jane Okonkwo",
        "role": "TEACHER",
    },
}

SCHOOL = {
    "id": "slx-hq",
    "name": "Schooly Luxe International Academy",
    "code": "SLX-HQ",
    "address": "14 Emerald Heights, Victoria Island",
}

# ---------------------------------------------------------------------------
# Seed / demo data factory
# ---------------------------------------------------------------------------

def _make_seed_data() -> dict[str, Any]:
    today = date.today()
    yesterday = today - timedelta(days=1)

    students: list[dict] = [
        {
            "id": "stu-001",
            "firstName": "Amina",
            "lastName": "Rashid",
            "admissionNo": "SLX-001",
            "className": "JSS 1",
            "createdAt": datetime(2025, 9, 1),
        },
        {
            "id": "stu-002",
            "firstName": "Daniel",
            "lastName": "Okoro",
            "admissionNo": "SLX-002",
            "className": "JSS 2",
            "createdAt": datetime(2025, 9, 1),
        },
        {
            "id": "stu-003",
            "firstName": "Lina",
            "lastName": "Farouk",
            "admissionNo": "SLX-003",
            "className": "SS 1",
            "createdAt": datetime(2025, 9, 1),
        },
        {
            "id": "stu-004",
            "firstName": "Emeka",
            "lastName": "Nwachukwu",
            "admissionNo": "SLX-004",
            "className": "SS 2",
            "createdAt": datetime(2025, 10, 5),
        },
        {
            "id": "stu-005",
            "firstName": "Zara",
            "lastName": "Ibrahim",
            "admissionNo": "SLX-005",
            "className": "JSS 3",
            "createdAt": datetime(2025, 10, 5),
        },
    ]

    attendance: list[dict] = [
        # today
        {"id": "att-001", "studentId": "stu-001", "date": today, "status": "PRESENT", "note": ""},
        {"id": "att-002", "studentId": "stu-002", "date": today, "status": "LATE", "note": "Arrived after morning briefing"},
        {"id": "att-003", "studentId": "stu-003", "date": today, "status": "PRESENT", "note": ""},
        {"id": "att-004", "studentId": "stu-004", "date": today, "status": "ABSENT", "note": "Sick leave"},
        {"id": "att-005", "studentId": "stu-005", "date": today, "status": "PRESENT", "note": ""},
        # yesterday
        {"id": "att-006", "studentId": "stu-001", "date": yesterday, "status": "PRESENT", "note": ""},
        {"id": "att-007", "studentId": "stu-002", "date": yesterday, "status": "PRESENT", "note": ""},
        {"id": "att-008", "studentId": "stu-003", "date": yesterday, "status": "ABSENT", "note": "Family event"},
    ]

    assets: list[dict] = [
        {
            "id": "ast-001",
            "name": "Computer Lab Workstation 01",
            "category": "Computer",
            "serialNumber": "ICT-LAB-001",
            "status": "ACTIVE",
            "purchaseDate": date(2025, 1, 15),
        },
        {
            "id": "ast-002",
            "name": "Projector – Hall A",
            "category": "Projector",
            "serialNumber": "ICT-PROJ-002",
            "status": "MAINTENANCE",
            "purchaseDate": date(2025, 1, 15),
        },
        {
            "id": "ast-003",
            "name": "Network Switch Core",
            "category": "Networking",
            "serialNumber": "ICT-NET-003",
            "status": "ACTIVE",
            "purchaseDate": date(2025, 1, 15),
        },
        {
            "id": "ast-004",
            "name": "Computer Lab Workstation 02",
            "category": "Computer",
            "serialNumber": "ICT-LAB-004",
            "status": "ACTIVE",
            "purchaseDate": date(2025, 3, 20),
        },
        {
            "id": "ast-005",
            "name": "UPS Battery Backup",
            "category": "Power",
            "serialNumber": "ICT-PWR-005",
            "status": "RETIRED",
            "purchaseDate": date(2024, 6, 10),
        },
    ]

    invoices: list[dict] = [
        {
            "id": "inv-001",
            "title": "Term 1 Tuition Batch",
            "amount": 120_000.0,
            "dueDate": date(2026, 6, 15),
            "payments": [45_000.0],
        },
        {
            "id": "inv-002",
            "title": "ICT Lab Maintenance Fee",
            "amount": 35_000.0,
            "dueDate": date(2026, 5, 30),
            "payments": [35_000.0],
        },
        {
            "id": "inv-003",
            "title": "Term 2 Tuition Deposit",
            "amount": 80_000.0,
            "dueDate": date(2026, 9, 1),
            "payments": [],
        },
    ]

    return {
        "students": students,
        "attendance": attendance,
        "assets": assets,
        "invoices": invoices,
    }


# ---------------------------------------------------------------------------
# Session state initialisation
# ---------------------------------------------------------------------------

def _init_state() -> None:
    if "logged_in" not in st.session_state:
        st.session_state["logged_in"] = False
        st.session_state["user"] = None
        st.session_state["page"] = "Dashboard"
        data = _make_seed_data()
        st.session_state["students"] = data["students"]
        st.session_state["attendance"] = data["attendance"]
        st.session_state["assets"] = data["assets"]
        st.session_state["invoices"] = data["invoices"]


_init_state()

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _student_name(student_id: str) -> str:
    for s in st.session_state["students"]:
        if s["id"] == student_id:
            return f"{s['firstName']} {s['lastName']}"
    return student_id


def _badge(text: str, colour: str) -> str:
    """Return an HTML badge span."""
    return (
        f'<span style="background:{colour};color:#0f172a;padding:2px 10px;'
        f'border-radius:12px;font-size:0.75rem;font-weight:700;">{text}</span>'
    )


STATUS_COLOURS = {
    "PRESENT": "#22c55e",
    "LATE": "#f59e0b",
    "ABSENT": "#ef4444",
    "ACTIVE": "#22c55e",
    "MAINTENANCE": "#f59e0b",
    "RETIRED": "#94a3b8",
}


def _status_badge(status: str) -> str:
    return _badge(status, STATUS_COLOURS.get(status, "#64748b"))


# ---------------------------------------------------------------------------
# Custom CSS
# ---------------------------------------------------------------------------
st.markdown(
    """
    <style>
    /* ── Sidebar ── */
    [data-testid="stSidebar"] {
        background: #0f172a;
        border-right: 1px solid rgba(255,255,255,0.08);
    }
    /* ── Metric cards ── */
    [data-testid="stMetric"] {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 1rem 1.25rem;
    }
    [data-testid="stMetricValue"] { font-size: 1.9rem !important; font-weight: 700; }
    /* ── Data rows ── */
    .sl-row {
        background: rgba(15,23,42,0.5);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px;
        padding: 0.65rem 1rem;
        margin-bottom: 0.4rem;
    }
    .sl-row p { margin: 0; }
    .sl-label { font-size: 0.8rem; color: #94a3b8; }
    /* ── Section headings ── */
    h2 { font-size: 1.15rem !important; font-weight: 600 !important; }
    /* ── Hide Streamlit branding ── */
    #MainMenu { visibility: hidden; }
    footer { visibility: hidden; }
    /* ── Sidebar logo area ── */
    .sl-logo { text-align: center; padding: 1rem 0 0.5rem; }
    .sl-logo-title {
        font-size: 1.3rem;
        font-weight: 800;
        color: #f59e0b;
        letter-spacing: 0.02em;
    }
    .sl-logo-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------------------------
# Login page
# ---------------------------------------------------------------------------

def page_login() -> None:
    col1, col2, col3 = st.columns([1, 1.4, 1])
    with col2:
        st.markdown("<br><br>", unsafe_allow_html=True)
        st.markdown(
            '<div style="text-align:center">'
            '<span style="font-size:2.8rem;">🎓</span>'
            '<h1 style="font-size:2rem;font-weight:800;color:#f59e0b;margin:0.2rem 0 0.1rem;">Schooly Luxe</h1>'
            '<p style="color:#94a3b8;font-size:0.9rem;margin-bottom:1.5rem;">Premium School Management Platform</p>'
            "</div>",
            unsafe_allow_html=True,
        )

        with st.form("login_form"):
            email = st.text_input("Email address", placeholder="admin@schoolyluxe.com")
            password = st.text_input("Password", type="password", placeholder="••••••••••")
            submitted = st.form_submit_button("Sign in →", use_container_width=True)

        if submitted:
            user = DEMO_USERS.get(email.strip().lower())
            if user and user["password"] == password:
                st.session_state["logged_in"] = True
                st.session_state["user"] = {
                    "email": email.strip().lower(),
                    "name": user["name"],
                    "role": user["role"],
                }
                st.session_state["page"] = "Dashboard"
                st.rerun()
            else:
                st.error("Invalid credentials. Try admin@schoolyluxe.com / Admin@12345")

        st.markdown("<br>", unsafe_allow_html=True)
        with st.expander("🔑 Demo credentials"):
            st.markdown(
                "| Email | Password | Role |\n"
                "|---|---|---|\n"
                "| admin@schoolyluxe.com | Admin@12345 | ADMIN |\n"
                "| teacher@schoolyluxe.com | Teacher@12345 | TEACHER |"
            )


# ---------------------------------------------------------------------------
# Sidebar navigation
# ---------------------------------------------------------------------------

def _sidebar() -> None:
    with st.sidebar:
        st.markdown(
            '<div class="sl-logo">'
            '<div style="font-size:2rem;">🎓</div>'
            '<div class="sl-logo-title">Schooly Luxe</div>'
            '<div class="sl-logo-sub">Premium School Management</div>'
            "</div>",
            unsafe_allow_html=True,
        )
        st.markdown("---")

        user = st.session_state["user"]
        st.markdown(
            f'<div style="padding:0.5rem 0.5rem 0;">'
            f'<p style="font-weight:600;margin:0;">{user["name"]}</p>'
            f'<p style="font-size:0.75rem;color:#94a3b8;margin:0;">{user["role"]} · {SCHOOL["code"]}</p>'
            f"</div>",
            unsafe_allow_html=True,
        )
        st.markdown("---")

        pages = ["Dashboard", "Students", "Attendance", "ICT Assets"]
        icons = ["📊", "👩‍🎓", "📋", "🖥️"]
        for icon, pg in zip(icons, pages):
            active = st.session_state["page"] == pg
            label = f"{icon} **{pg}**" if active else f"{icon} {pg}"
            if st.button(label, key=f"nav_{pg}", use_container_width=True):
                st.session_state["page"] = pg
                st.rerun()

        st.markdown("---")
        if st.button("⏻  Sign out", use_container_width=True):
            st.session_state["logged_in"] = False
            st.session_state["user"] = None
            st.rerun()

        st.markdown(
            f'<div style="font-size:0.7rem;color:#475569;text-align:center;padding-top:0.5rem;">'
            f'{SCHOOL["name"]}<br>{SCHOOL["address"]}</div>',
            unsafe_allow_html=True,
        )


# ---------------------------------------------------------------------------
# Dashboard page
# ---------------------------------------------------------------------------

def page_dashboard() -> None:
    st.markdown("## 📊 Dashboard")
    today = date.today()

    students = st.session_state["students"]
    attendance = st.session_state["attendance"]
    assets = st.session_state["assets"]
    invoices = st.session_state["invoices"]

    today_att = [a for a in attendance if a["date"] == today]
    present_today = sum(1 for a in today_att if a["status"] == "PRESENT")
    active_assets = sum(1 for a in assets if a["status"] == "ACTIVE")

    total_invoiced = sum(inv["amount"] for inv in invoices)
    total_paid = sum(sum(inv["payments"]) for inv in invoices)
    outstanding = total_invoiced - total_paid

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Students", len(students))
    col2.metric("Attendance Today", len(today_att), f"{present_today} present")
    col3.metric("ICT Assets", len(assets), f"{active_assets} active")
    col4.metric("Outstanding Invoices", f"₦{outstanding:,.0f}", f"₦{total_paid:,.0f} collected")

    st.markdown("---")
    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("### Today's Attendance")
        if today_att:
            df = pd.DataFrame(
                [
                    {
                        "Student": _student_name(a["studentId"]),
                        "Status": a["status"],
                        "Note": a["note"] or "—",
                    }
                    for a in today_att
                ]
            )
            st.dataframe(df, use_container_width=True, hide_index=True)
        else:
            st.info("No attendance records for today yet.")

    with col_b:
        st.markdown("### Recent Students")
        recent = sorted(students, key=lambda s: s["createdAt"], reverse=True)[:5]
        df2 = pd.DataFrame(
            [
                {
                    "Name": f"{s['firstName']} {s['lastName']}",
                    "Class": s["className"],
                    "Admission No.": s["admissionNo"],
                }
                for s in recent
            ]
        )
        st.dataframe(df2, use_container_width=True, hide_index=True)

    st.markdown("---")
    st.markdown("### Asset Status Breakdown")
    asset_counts = {}
    for a in assets:
        asset_counts[a["status"]] = asset_counts.get(a["status"], 0) + 1
    st.bar_chart(pd.Series(asset_counts), use_container_width=True, height=220)


# ---------------------------------------------------------------------------
# Students page
# ---------------------------------------------------------------------------

def page_students() -> None:
    st.markdown("## 👩‍🎓 Students")

    col_list, col_form = st.columns([1.4, 1])

    with col_list:
        students = st.session_state["students"]
        st.markdown(f"**{len(students)} enrolled students**")
        if students:
            df = pd.DataFrame(
                [
                    {
                        "Name": f"{s['firstName']} {s['lastName']}",
                        "Admission No.": s["admissionNo"],
                        "Class": s["className"],
                    }
                    for s in students
                ]
            )
            st.dataframe(df, use_container_width=True, hide_index=True, height=460)
        else:
            st.info("No students yet. Add one →")

    with col_form:
        st.markdown("#### Add student")
        with st.form("add_student_form", clear_on_submit=True):
            first_name = st.text_input("First name", placeholder="Amina")
            last_name = st.text_input("Last name", placeholder="Rashid")
            admission_no = st.text_input("Admission number", placeholder="SLX-006")
            class_name = st.text_input("Class", placeholder="JSS 1")
            submitted = st.form_submit_button("Create student", use_container_width=True)

        if submitted:
            # Validate
            if not all([first_name, last_name, admission_no, class_name]):
                st.error("All fields are required.")
            elif any(s["admissionNo"] == admission_no for s in st.session_state["students"]):
                st.error(f"Admission number '{admission_no}' already exists.")
            else:
                st.session_state["students"].append(
                    {
                        "id": f"stu-{uuid.uuid4().hex[:8]}",
                        "firstName": first_name,
                        "lastName": last_name,
                        "admissionNo": admission_no,
                        "className": class_name,
                        "createdAt": datetime.now(),
                    }
                )
                st.success(f"Student {first_name} {last_name} added!")
                st.rerun()


# ---------------------------------------------------------------------------
# Attendance page
# ---------------------------------------------------------------------------

def page_attendance() -> None:
    st.markdown("## 📋 Attendance")

    students = st.session_state["students"]
    attendance = st.session_state["attendance"]

    col_list, col_form = st.columns([1.4, 1])

    with col_list:
        st.markdown(f"**{len(attendance)} total records**")
        if attendance:
            df = pd.DataFrame(
                [
                    {
                        "Student": _student_name(a["studentId"]),
                        "Date": a["date"].strftime("%Y-%m-%d") if hasattr(a["date"], "strftime") else str(a["date"]),
                        "Status": a["status"],
                        "Note": a["note"] or "—",
                    }
                    for a in sorted(attendance, key=lambda x: x["date"], reverse=True)
                ]
            )
            st.dataframe(df, use_container_width=True, hide_index=True, height=460)
        else:
            st.info("No attendance records yet.")

    with col_form:
        st.markdown("#### Record attendance")
        if not students:
            st.warning("Add students first.")
        else:
            with st.form("add_attendance_form", clear_on_submit=True):
                student_options = {
                    f"{s['firstName']} {s['lastName']} ({s['admissionNo']})": s["id"]
                    for s in students
                }
                selected_student_label = st.selectbox("Student", list(student_options.keys()))
                att_date = st.date_input("Date", value=date.today())
                status = st.selectbox("Status", ["PRESENT", "ABSENT", "LATE"])
                note = st.text_input("Note (optional)", placeholder="e.g. medical leave")
                submitted = st.form_submit_button("Save record", use_container_width=True)

            if submitted:
                student_id = student_options[selected_student_label]
                # Check for duplicate
                duplicate = any(
                    a["studentId"] == student_id and a["date"] == att_date
                    for a in attendance
                )
                if duplicate:
                    st.error("An attendance record for this student on this date already exists.")
                else:
                    st.session_state["attendance"].append(
                        {
                            "id": f"att-{uuid.uuid4().hex[:8]}",
                            "studentId": student_id,
                            "date": att_date,
                            "status": status,
                            "note": note,
                        }
                    )
                    st.success("Attendance record saved!")
                    st.rerun()


# ---------------------------------------------------------------------------
# ICT Assets page
# ---------------------------------------------------------------------------

def page_assets() -> None:
    st.markdown("## 🖥️ ICT Asset Registry")

    assets = st.session_state["assets"]

    col_list, col_form = st.columns([1.4, 1])

    with col_list:
        st.markdown(f"**{len(assets)} registered assets**")
        if assets:
            df = pd.DataFrame(
                [
                    {
                        "Asset Name": a["name"],
                        "Category": a["category"],
                        "Serial Number": a["serialNumber"],
                        "Status": a["status"],
                        "Purchase Date": a["purchaseDate"].strftime("%Y-%m-%d") if a.get("purchaseDate") else "—",
                    }
                    for a in assets
                ]
            )
            st.dataframe(df, use_container_width=True, hide_index=True, height=460)
        else:
            st.info("No assets registered yet.")

    with col_form:
        st.markdown("#### Add ICT asset")
        with st.form("add_asset_form", clear_on_submit=True):
            name = st.text_input("Asset name", placeholder="Computer Lab Workstation 06")
            category = st.text_input("Category", placeholder="Computer")
            serial_number = st.text_input("Serial number", placeholder="ICT-LAB-006")
            status = st.selectbox("Status", ["ACTIVE", "MAINTENANCE", "RETIRED"])
            purchase_date = st.date_input("Purchase date", value=date.today())
            submitted = st.form_submit_button("Create asset", use_container_width=True)

        if submitted:
            if not all([name, category, serial_number]):
                st.error("Name, category and serial number are required.")
            elif any(a["serialNumber"] == serial_number for a in assets):
                st.error(f"Serial number '{serial_number}' already exists.")
            else:
                st.session_state["assets"].append(
                    {
                        "id": f"ast-{uuid.uuid4().hex[:8]}",
                        "name": name,
                        "category": category,
                        "serialNumber": serial_number,
                        "status": status,
                        "purchaseDate": purchase_date,
                    }
                )
                st.success(f"Asset '{name}' registered!")
                st.rerun()


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

if not st.session_state["logged_in"]:
    page_login()
else:
    _sidebar()
    page = st.session_state["page"]
    if page == "Dashboard":
        page_dashboard()
    elif page == "Students":
        page_students()
    elif page == "Attendance":
        page_attendance()
    elif page == "ICT Assets":
        page_assets()
