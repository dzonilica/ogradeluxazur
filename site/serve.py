# Lokalni server koji zabranjuje kesiranje - uvek servira najnoviji fajl.
import http.server, socketserver

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", 8777), H) as s:
    print("http://localhost:8777")
    s.serve_forever()
