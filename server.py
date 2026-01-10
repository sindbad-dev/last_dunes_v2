#!/usr/bin/env python3
"""
Serveur HTTP simple pour Last Dunes
Lance le jeu sur http://localhost:8000
"""
import http.server
import socketserver
import os

PORT = 8000

# Change to the directory containing the script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print("=" * 60)
    print("  LAST DUNES - Serveur de développement")
    print("=" * 60)
    print(f"\n  🎮 Jeu disponible sur: http://localhost:{PORT}")
    print(f"  📂 Dossier servi: {os.getcwd()}")
    print("\n  Pour arrêter le serveur: Ctrl+C\n")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  Serveur arrêté.")
