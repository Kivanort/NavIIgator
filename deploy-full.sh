#!/bin/bash
# =============================================================================
# deploy-full.sh — Полный деплой NavIIgator на ВМ Yandex Cloud
# ВМ: 93.77.187.81 (команда 3)
# Порт: 8000
#
# Использование:
#   chmod +x deploy-full.sh && ./deploy-full.sh
# =============================================================================

set -e

VM_IP="93.77.187.81"
VM_USER="ubuntu"
REPO_URL="https://github.com/Kivanort/NavIIgator.git"

# Yandex Cloud API-ключ передаётся через переменную окружения:
#   export YC_API_KEY="ваш_ключ"
# или через файл .env в корне проекта
if [ -z "$YC_API_KEY" ]; then
    if [ -f .env ]; then
        export $(grep -E '^YC_API_KEY=' .env | xargs)
    fi
fi

if [ -z "$YC_API_KEY" ]; then
    echo "❌ Ошибка: YC_API_KEY не задан!"
    echo "   Выполните: export YC_API_KEY=\"ваш_ключ\""
    echo "   или создайте файл .env с строкой YC_API_KEY=ваш_ключ"
    exit 1
fi

echo "=========================================="
echo "  NavIIgator — Полный деплой"
echo "  VM: ${VM_USER}@${VM_IP}"
echo "  URL: http://${VM_IP}:8000"
echo "=========================================="
echo ""

ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} bash <<REMOTE_SCRIPT
set -e

PROJECT_DIR="/opt/naviigator"
REPO_URL="https://github.com/Kivanort/NavIIgator.git"
YC_API_KEY="${YC_API_KEY}"

echo "[1/7] Обновление системы..."
sudo apt-get update -qq
sudo apt-get install -y -qq ca-certificates curl gnupg lsb-release git >/dev/null 2>&1
echo "  ✓ Готово"

echo ""
echo "[2/7] Установка Docker..."
if ! command -v docker &>/dev/null; then
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg 2>/dev/null
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin >/dev/null 2>&1
    sudo usermod -aG docker $USER
    echo "  ✓ Docker установлен"
else
    echo "  ✓ Docker уже установлен: $(docker --version)"
fi

echo ""
echo "[3/7] Клонирование репозитория..."
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    git pull origin main
    echo "  ✓ Репозиторий обновлён"
else
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown $(whoami) "$PROJECT_DIR"
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    echo "  ✓ Репозиторий клонирован"
fi

echo ""
echo "[4/7] Создание .env.local..."
cat > .env.local <<EOF
YC_API_KEY=$YC_API_KEY
EOF
echo "  ✓ .env.local создан"

echo ""
echo "[5/7] Настройка порта 8000..."
sed -i 's/"3000:3000"/"8000:3000"/g' docker-compose.yml
echo "  ✓ Готово"

echo ""
echo "[6/7] Сборка и запуск контейнера..."
docker compose down 2>/dev/null || true
docker compose up -d --build 2>&1 | tail -5
echo "  ✓ Контейнер запущен"

echo ""
echo "[7/7] Проверка статуса..."
sleep 5
if docker compose ps | grep -q "Up"; then
    echo "  ✓ Контейнер работает"
else
    echo "  ✗ Ошибка! Логи:"
    docker compose logs --tail=20
    exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 || true)
if echo "$HTTP_CODE" | grep -q "200\|301\|302"; then
    echo "  ✓ HTTP отвечает (код $HTTP_CODE)"
else
    echo "  ⚠ HTTP код: $HTTP_CODE (контейнер может ещё стартовать)"
fi

echo ""
echo "=========================================="
echo "  ✅ ДЕПЛОЙ ЗАВЕРШЁН"
echo "  URL: http://93.77.187.81:8000"
echo "  Логи: docker compose logs -f"
echo "=========================================="

REMOTE_SCRIPT

echo ""
echo "🎉 Деплой завершён!"
echo "🌐 http://${VM_IP}:8000"
