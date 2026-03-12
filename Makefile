.PHONY: install start stop ml estimator market portal help

# ── Install / setup ────────────────────────────────────────────────────────────

install:
	@echo "Setting up Python virtual environments..."
	cd house-price-api && python -m venv .venv && .venv/Scripts/pip install -q -r requirements.txt
	cd property-estimator-api && python -m venv .venv && .venv/Scripts/pip install -q -r requirements.txt
	@echo "Installing Next.js dependencies..."
	cd nextjs-portal && npm install
	@echo "Downloading Maven dependencies..."
	cd market-analysis-api && mvn dependency:go-offline -q
	@echo "Done! Run 'make start' to launch all services."

# ── Individual services ────────────────────────────────────────────────────────

ml:
	@echo "Starting ML Model API on port 8000..."
	cd house-price-api && .venv/Scripts/uvicorn app.main:app --port 8000 --reload

estimator:
	@echo "Starting Property Estimator API on port 8001..."
	cd property-estimator-api && .venv/Scripts/uvicorn app.main:app --port 8001 --reload

market:
	@echo "Starting Market Analysis API on port 8080..."
	cd market-analysis-api && mvn spring-boot:run

portal:
	@echo "Starting Next.js Portal on port 3000..."
	cd nextjs-portal && npm run dev

# ── Help ───────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make ml         - Start ML Model API        (port 8000)"
	@echo "  make estimator  - Start Property Estimator  (port 8001)"
	@echo "  make market     - Start Market Analysis API (port 8080)"
	@echo "  make portal     - Start Next.js Portal      (port 3000)"
	@echo ""
	@echo "Run each in a separate terminal in this order:"
	@echo "  1. make ml"
	@echo "  2. make estimator"
	@echo "  3. make market"
	@echo "  4. make portal"
	@echo ""
