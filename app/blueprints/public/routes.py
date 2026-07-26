# app/blueprints/public/routes.py

from flask import flash, redirect, render_template, request, url_for

from app.blueprints.public import public_bp

OG_IMAGE = "images/brand/arakunrin-og.jpg"


def _seo(endpoint, title, description, **url_kwargs):
    return {
        "title": title,
        "description": description,
        "canonical_url": url_for(endpoint, _external=True, **url_kwargs),
        "og_type": "website",
        "og_image": url_for("static", filename=OG_IMAGE, _external=True),
    }


@public_bp.route("/")
def home():
    seo = _seo(
        "public.home",
        "ARÁKÙNRIN — The Institute for Male Formation",
        "Africa's premier institution for lifelong male formation. Forming Boys. Forging Men. Building Legacies.",
    )
    return render_template("public/home.html", seo=seo)


@public_bp.route("/about")
def about():
    seo = _seo(
        "public.about",
        "About — ARÁKÙNRIN",
        "To intentionally form boys and men into leaders of character, conviction, competence and legacy.",
    )
    return render_template("public/about.html", seo=seo)


@public_bp.route("/our-work")
def our_work():
    seo = _seo(
        "public.our_work",
        "Our Work — ARÁKÙNRIN",
        "BTMT, the core ARÁKÙNRIN formation track, and Legacy One — beyond events, towards formation.",
    )
    return render_template("public/our_work.html", seo=seo)


@public_bp.route("/the-gathering")
def gathering():
    seo = _seo(
        "public.gathering",
        "The Gathering 2026 — ARÁKÙNRIN",
        "The Gathering 2026 — The Weight of a Man. An intimate experience of brotherhood, reflection & formation. 27 September 2026, RCCG Messiah's Place, Magboro.",
    )
    return render_template("public/gathering.html", seo=seo)


@public_bp.route("/gallery")
def gallery():
    seo = _seo(
        "public.gallery",
        "Gallery — ARÁKÙNRIN",
        "Photography direction and the Gathering 2026 collateral system — the visual language of ARÁKÙNRIN.",
    )
    return render_template("public/gallery.html", seo=seo)


@public_bp.route("/partners")
def partners():
    seo = _seo(
        "public.partners",
        "Partners — ARÁKÙNRIN",
        "Legacy One. Partnering today, building tomorrow. Your support is building men, strengthening families, and transforming nations.",
    )
    return render_template("public/partners.html", seo=seo)


@public_bp.route("/contact", methods=["GET", "POST"])
def contact():
    seo = _seo(
        "public.contact",
        "Contact — ARÁKÙNRIN",
        "Begin the enquiry. Not another conference. A beginning.",
    )
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = request.form.get("message", "").strip()
        if not name or not email or not message:
            flash("Please complete all required fields.", "error")
            return render_template("public/contact.html", seo=seo)
        flash("Thank you for reaching out. We will respond within 24 hours.", "success")
        return redirect(url_for("public.contact"))
    return render_template("public/contact.html", seo=seo)


# ---------------------------------------------------------------------------
# Legacy Konvexity URLs — redirected (not 404s) in case anything external
# still links to the old paths. Remove once you're confident nothing does.
# ---------------------------------------------------------------------------

@public_bp.route("/solutions")
@public_bp.route("/solutions/<path:slug>")
@public_bp.route("/programs")
@public_bp.route("/programs/<path:slug>")
def legacy_our_work(slug=None):
    return redirect(url_for("public.our_work"), code=301)


@public_bp.route("/faculty")
@public_bp.route("/faculty/<path:slug>")
def legacy_faculty(slug=None):
    return redirect(url_for("public.about"), code=301)


@public_bp.route("/founder")
def legacy_founder():
    return redirect(url_for("public.about"), code=301)


@public_bp.route("/clients")
def legacy_clients():
    return redirect(url_for("public.partners"), code=301)


@public_bp.route("/events")
def legacy_events():
    return redirect(url_for("public.gathering"), code=301)


@public_bp.route("/blog")
@public_bp.route("/resources")
def legacy_content():
    return redirect(url_for("public.gallery"), code=301)


@public_bp.route("/sitemap.xml")
def sitemap():
    pages = [
        {"loc": url_for("public.home", _external=True), "priority": "1.0"},
        {"loc": url_for("public.about", _external=True), "priority": "0.9"},
        {"loc": url_for("public.our_work", _external=True), "priority": "0.9"},
        {"loc": url_for("public.gathering", _external=True), "priority": "0.9"},
        {"loc": url_for("public.gallery", _external=True), "priority": "0.7"},
        {"loc": url_for("public.partners", _external=True), "priority": "0.6"},
        {"loc": url_for("public.contact", _external=True), "priority": "0.7"},
    ]
    sitemap_xml = render_template("public/sitemap.xml", pages=pages)
    return sitemap_xml, 200, {"Content-Type": "application/xml"}
