#!/bin/bash

# ============================================
# DWYREX GPU Server Installation Script
# https://dwyrex.vercel.app
# ============================================

set -e

GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GOLD}"
echo "  ██████╗ ██╗    ██╗██╗   ██╗██████╗ ███████╗██╗  ██╗"
echo "  ██╔══██╗██║    ██║╚██╗ ██╔╝██╔══██╗██╔════╝╚██╗██╔╝"
echo "  ██║  ██║██║ █╗ ██║ ╚████╔╝ ██████╔╝█████╗   ╚███╔╝ "
echo "  ██║  ██║██║███╗██║  ╚██╔╝  ██╔══██╗██╔══╝   ██╔██╗ "
echo "  ██████╔╝╚███╔███╔╝   ██║   ██║  ██║███████╗██╔╝ ██╗"
echo "  ╚═════╝  ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${GOLD}  THE KING OF COMPUTE — GPU Server Setup v1.0${NC}"
echo -e "${GOLD}  https://dwyrex.vercel.app${NC}"
echo ""

# Root check
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Bu script root olarak calistirilmalidir.${NC}"
  echo "Lutfen 'sudo bash install.sh' komutuyla calistirin."
  exit 1
fi

log() { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${GOLD}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── ADIM 1: Sistem Guncelleme ────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 1: Sistem Guncellenmesi ═══${NC}"
info "Paket listesi guncelleniyor..."
apt-get update -qq
apt-get upgrade -y -qq
log "Sistem guncellendi"

# ── ADIM 2: Temel Paketler ───────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 2: Temel Paketler ═══${NC}"
info "Gerekli paketler kuruluyor..."
apt-get install -y -qq \
  curl wget git htop nvtop \
  build-essential software-properties-common \
  apt-transport-https ca-certificates gnupg \
  python3 python3-pip python3-venv \
  net-tools ufw fail2ban
log "Temel paketler kuruldu"

# ── ADIM 3: NVIDIA Driver ────────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 3: NVIDIA Driver Kurulumu ═══${NC}"

if nvidia-smi &> /dev/null; then
  log "NVIDIA driver zaten yuklu: $(nvidia-smi --query-gpu=driver_version --format=csv,noheader | head -1)"
else
  info "NVIDIA driver kuruluyor..."
  add-apt-repository ppa:graphics-drivers/ppa -y -q
  apt-get update -qq
  apt-get install -y -qq ubuntu-drivers-common
  ubuntu-drivers autoinstall
  log "NVIDIA driver kuruldu (yeniden baslatma gerekebilir)"
fi

# ── ADIM 4: CUDA ─────────────────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 4: CUDA Kurulumu ═══${NC}"

if nvcc --version &> /dev/null; then
  log "CUDA zaten yuklu"
else
  info "CUDA 12.3 kuruluyor..."
  wget -q https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
  dpkg -i cuda-keyring_1.1-1_all.deb
  apt-get update -qq
  apt-get install -y -qq cuda-toolkit-12-3
  echo 'export PATH=/usr/local/cuda/bin:$PATH' >> /etc/environment
  echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> /etc/environment
  rm -f cuda-keyring_1.1-1_all.deb
  log "CUDA 12.3 kuruldu"
fi

# ── ADIM 5: Docker ───────────────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 5: Docker Kurulumu ═══${NC}"

if docker --version &> /dev/null; then
  log "Docker zaten yuklu: $(docker --version)"
else
  info "Docker kuruluyor..."
  curl -fsSL https://get.docker.com | sh -q
  systemctl enable docker
  systemctl start docker
  log "Docker kuruldu"
fi

# ── ADIM 6: NVIDIA Container Toolkit ─────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 6: NVIDIA Container Toolkit ═══${NC}"

if dpkg -l | grep -q nvidia-container-toolkit; then
  log "NVIDIA Container Toolkit zaten yuklu"
else
  info "NVIDIA Container Toolkit kuruluyor..."
  curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
  apt-get update -qq
  apt-get install -y -qq nvidia-container-toolkit
  nvidia-ctk runtime configure --runtime=docker
  systemctl restart docker
  log "NVIDIA Container Toolkit kuruldu"
fi

# ── ADIM 7: Guvenlik Ayarlari ─────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 7: Guvenlik Ayarlari ═══${NC}"
info "Firewall yapilandiriliyor..."
ufw --force reset > /dev/null
ufw default deny incoming > /dev/null
ufw default allow outgoing > /dev/null
ufw allow 22/tcp > /dev/null
ufw allow 8888/tcp > /dev/null
ufw --force enable > /dev/null
log "Firewall aktif (SSH:22, Jupyter:8888)"

info "Fail2Ban yapilandiriliyor..."
systemctl enable fail2ban > /dev/null
systemctl start fail2ban > /dev/null
log "Fail2Ban aktif"

# ── ADIM 8: DWYREX Kullanicisi ────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 8: DWYREX Kullanicisi ═══${NC}"
if id "dwyrex" &>/dev/null; then
  log "dwyrex kullanicisi zaten mevcut"
else
  info "dwyrex kullanicisi olusturuluyor..."
  useradd -m -s /bin/bash dwyrex
  usermod -aG docker dwyrex
  usermod -aG sudo dwyrex
  log "dwyrex kullanicisi olusturuldu"
fi

# ── ADIM 9: Monitoring Agent ──────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 9: Monitoring Agent ═══${NC}"
info "DWYREX monitoring agent kuruluyor..."

cat > /usr/local/bin/dwyrex-monitor.sh << 'MONITOR'
#!/bin/bash
# DWYREX GPU Monitoring Agent
while true; do
  if command -v nvidia-smi &> /dev/null; then
    GPU_USAGE=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits | head -1)
    GPU_TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits | head -1)
    GPU_MEM=$(nvidia-smi --query-gpu=utilization.memory --format=csv,noheader,nounits | head -1)
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    RAM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    echo "$(date '+%Y-%m-%d %H:%M:%S') GPU:${GPU_USAGE}% TEMP:${GPU_TEMP}C MEM:${GPU_MEM}% CPU:${CPU_USAGE}% RAM:${RAM_USAGE}%"
  fi
  sleep 60
done
MONITOR

chmod +x /usr/local/bin/dwyrex-monitor.sh

cat > /etc/systemd/system/dwyrex-monitor.service << 'SERVICE'
[Unit]
Description=DWYREX GPU Monitoring Agent
After=network.target

[Service]
ExecStart=/usr/local/bin/dwyrex-monitor.sh
Restart=always
User=root
StandardOutput=append:/var/log/dwyrex-monitor.log

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable dwyrex-monitor > /dev/null
systemctl start dwyrex-monitor > /dev/null
log "Monitoring agent aktif"

# ── ADIM 10: Python AI Ortami ─────────────────────────────────
echo ""
echo -e "${GOLD}═══ ADIM 10: Python AI Ortami ═══${NC}"
info "PyTorch ve AI kutuphaneleri kuruluyor..."
pip3 install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 2>/dev/null || warn "PyTorch kurulumu atlandı"
pip3 install -q jupyterlab numpy pandas scikit-learn transformers 2>/dev/null || warn "Python kutuphaneleri kısmen kuruldu"
log "Python AI ortami hazir"

# ── OZET ──────────────────────────────────────────────────────
echo ""
echo -e "${GOLD}═══════════════════════════════════════════${NC}"
echo -e "${GOLD}  DWYREX Kurulumu Tamamlandi!${NC}"
echo -e "${GOLD}═══════════════════════════════════════════${NC}"
echo ""

# GPU bilgisi
if nvidia-smi &> /dev/null; then
  GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -1)
  GPU_COUNT=$(nvidia-smi --query-gpu=name --format=csv,noheader | wc -l)
  echo -e "${GREEN}GPU Bilgisi:${NC}"
  echo -e "  Model: ${GOLD}${GPU_NAME}${NC}"
  echo -e "  Adet:  ${GOLD}${GPU_COUNT}${NC}"
  echo ""
fi

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo -e "${GREEN}Baglanti Bilgileri:${NC}"
echo -e "  SSH:     ${GOLD}ssh dwyrex@${SERVER_IP}${NC}"
echo -e "  Jupyter: ${GOLD}http://${SERVER_IP}:8888${NC}"
echo ""
echo -e "${GREEN}Hazirlik Kontrol:${NC}"
echo -e "  Docker:   ${GREEN}$(docker --version 2>/dev/null | cut -d' ' -f3 | tr -d ',')${NC}"
echo -e "  CUDA:     ${GREEN}$(nvcc --version 2>/dev/null | grep release | awk '{print $6}' | tr -d ',')${NC}"
echo -e "  Firewall: ${GREEN}Aktif${NC}"
echo -e "  Monitor:  ${GREEN}Aktif${NC}"
echo ""
echo -e "${GOLD}  DWYREX ekibi ile iletisime gecin:${NC}"
echo -e "${GOLD}  https://dwyrex.vercel.app${NC}"
echo -e "${GOLD}  WhatsApp: +90 545 870 1196${NC}"
echo ""