"""
Simulateur de données de télémétrie
-----------------------------------
Ce script envoie périodiquement des mesures de télémétrie vers l'API backend.

Usage :
    python scripts/simulator.py --source drone_1 --interval 2 --duration 60
"""
from __future__ import annotations

import argparse
import random
import sys
import time
import requests
from datetime import datetime


# ---------------------------
# Configuration par défaut
# ---------------------------

DEFAULT_API_URL = "http://127.0.0.1:8000/telemetry"
AVAILABLE_METRICS = {
    "temperature": (15.0, 35.0),
    "altitude": (0, 1000),
    "speed": (0, 50),
    "battery": (0, 100),
}


# ---------------------------
# Fonctions principales
# ---------------------------

def generate_metric() -> tuple[str, float]:
    """Génère une métrique aléatoire parmi les métriques disponibles."""
    metric = random.choice(list(AVAILABLE_METRICS.keys()))
    low, high = AVAILABLE_METRICS[metric]
    value = round(random.uniform(low, high), 2)
    return metric, value


def send_telemetry(api_url: str, source: str) -> bool:
    """Construit et envoie une requête POST de télémétrie."""
    metric, value = generate_metric()

    payload = {
        "source": source,
        "metric": metric,
        "value": value,
    }

    try:
        r = requests.post(api_url, json=payload, timeout=3)
        r.raise_for_status()
        print(f"[{datetime.now():%H:%M:%S}] ✅ Sent: {payload}")
        return True
    except requests.RequestException as e:
        print(f"[{datetime.now():%H:%M:%S}] ❌ Error: {e}")
        return False


def simulate(api_url: str, source: str, interval: float, duration: int):
    """Boucle principale de simulation."""
    print(f"\n🚀 Starting telemetry simulation for '{source}' → {api_url}\n")
    start_time = time.time()

    while time.time() - start_time < duration:
        send_telemetry(api_url, source)
        time.sleep(interval)

    print("\n🏁 Simulation completed.")


# ---------------------------
# Entrée CLI
# ---------------------------

def parse_args(argv: list[str] | None = None):
    parser = argparse.ArgumentParser(description="Simulateur de télémétrie")
    parser.add_argument("--source", type=str, default="simulator_1", help="Nom de la source (ex: drone_1)")
    parser.add_argument("--interval", type=float, default=2.0, help="Intervalle entre envois (secondes)")
    parser.add_argument("--duration", type=int, default=30, help="Durée totale de la simulation (secondes)")
    parser.add_argument("--url", type=str, default=DEFAULT_API_URL, help="URL de l'API FastAPI")
    return parser.parse_args(argv)


if __name__ == "__main__":
    args = parse_args(sys.argv[1:])
    simulate(args.url, args.source, args.interval, args.duration)
