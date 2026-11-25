build:
  ./build.py

pdf: build
  tectonic --outdir pdf pdf/cv_uhlik.tex
