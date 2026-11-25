#!/usr/bin/env python3

"""Build resume artifacts."""

import argparse
import re
from dataclasses import dataclass
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path

import jinja2
import yaml
from markupsafe import Markup, escape


@dataclass
class CLIArguments:
    """Parsed CLI Arguments."""

    templates: Path
    output_html: Path
    output_pdf: Path
    content: Path


def project_parts(value: str, links: dict, highlights=()):
    """Split plain text at complete project names and selected accomplishments."""
    tokens = set(links) | set(highlights)
    pattern = (
        r"(?<!\w)("
        + "|".join(re.escape(name) for name in sorted(tokens, key=len, reverse=True))
        + r")(?!\w)"
    )
    return re.split(pattern, value) if tokens else [value]


def html_project_links(value: str, links: dict, highlights=()) -> Markup:
    """Link names and emphasize results while keeping content escaped."""

    def render(part):
        text = (
            Markup('<a href="{}">{}</a>').format(links[part], part)
            if part in links
            else escape(part)
        )
        return (
            Markup("<strong>{}</strong>").format(text) if part in highlights else text
        )

    return Markup("").join(
        render(part) for part in project_parts(value, links, highlights)
    )


def tex_project_links(value: str, links: dict, highlights=()) -> str:
    """Render names and results in content already escaped for the TeX template."""

    def render(part):
        text = (
            "\\href{" + links[part] + "}{" + part.replace("_", "\\_") + "}"
            if part in links
            else part
        )
        return "\\textbf{" + text + "}" if part in highlights else text

    return "".join(render(part) for part in project_parts(value, links, highlights))


def build_html(config: CLIArguments, content: dict) -> None:
    """Build HTML artifact."""
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(config.templates),
        autoescape=jinja2.select_autoescape(["html"]),
    )

    env.filters["link_projects"] = html_project_links

    # Load template
    template = env.get_template("index.html")

    # Save file
    with (config.output_html / "index.html").open("w") as file:
        file.write(
            template.render(
                content, current_year=datetime.now(ZoneInfo("Europe/Prague")).year
            )
        )


def replace_deep(data: dict, old: str, new: str):
    """Replace all occurrences of `old` string with `new` in `data`."""
    if isinstance(data, str):
        return data.replace(old, new)
    if isinstance(data, dict):
        return {k: replace_deep(v, old, new) for k, v in data.items()}
    if isinstance(data, list):
        return [replace_deep(v, old, new) for v in data]
    if isinstance(data, tuple):
        return tuple(replace_deep(v, old, new) for v in data)
    raise ValueError("Unknown data type.")


def build_pdf(config: CLIArguments, content: dict) -> None:
    """Build PDF artifact."""
    # Create environment
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(config.templates),
        block_start_string=r"\BLOCK{",
        block_end_string="}",
        variable_start_string=r"\VAR{",
        variable_end_string="}",
        comment_start_string=r"\#{",
        comment_end_string="}",
        line_statement_prefix="%%",
        line_comment_prefix="%#",
        trim_blocks=True,
        autoescape=False,
    )

    env.filters["link_projects"] = tex_project_links

    # Load template
    template = env.get_template("cv_uhlik.tex")

    # Escape ampersand
    content = replace_deep(content, "&", r"\&")
    content = replace_deep(content, "%", r"\%")

    # Save file
    with (config.output_pdf / "cv_uhlik.tex").open("w") as file:
        file.write(template.render(content))


def parse_args() -> CLIArguments:
    """Parse CLI Arguments."""
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--templates",
        type=Path,
        default="templates",
        help="Path to the templates directory.",
    )
    parser.add_argument(
        "--output_html",
        type=Path,
        default="public",
        help="Path for the HTML output directory.",
    )
    parser.add_argument(
        "--output_pdf",
        type=Path,
        default="pdf",
        help="Path for the PDF output directory.",
    )
    parser.add_argument(
        "--content",
        type=Path,
        default="content.yaml",
        help="Path to YAML with content.",
    )
    args = parser.parse_args()
    return CLIArguments(
        templates=args.templates,
        output_html=args.output_html,
        output_pdf=args.output_pdf,
        content=args.content,
    )


def main() -> None:
    """Build resume artifacts."""
    config = parse_args()

    # Load content
    with config.content.open("r", encoding="utf-8") as stream:
        content = yaml.safe_load(stream)

    build_html(config, content)
    build_pdf(config, content)


if __name__ == "__main__":
    main()
