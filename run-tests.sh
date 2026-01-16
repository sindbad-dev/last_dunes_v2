#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
PASSED=0
FAILED=0

# Fonction pour afficher un test
test_start() {
    echo -e "${BLUE}[TEST]${NC} $1..."
    TOTAL=$((TOTAL + 1))
}

# Fonction pour succès
test_pass() {
    echo -e "${GREEN}[✓]${NC} $1"
    PASSED=$((PASSED + 1))
}

# Fonction pour échec
test_fail() {
    echo -e "${RED}[✗]${NC} $1"
    FAILED=$((FAILED + 1))
}

# Fonction pour info
test_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Header
echo "========================================="
echo "🧪 SUITE DE TESTS - LAST DUNES"
echo "========================================="
echo ""

# ==========================================
# TESTS DES FICHIERS JSON
# ==========================================

echo -e "${YELLOW}=== TESTS DES FICHIERS JSON ===${NC}"
echo ""

# Test 1: Vérifier que level-complete.json existe
test_start "Fichier level-complete.json existe"
if [ -f "data/level-complete.json" ]; then
    test_pass "level-complete.json trouvé"
else
    test_fail "level-complete.json absent"
fi

# Test 2: Valider JSON level-complete.json
test_start "Validation JSON de level-complete.json"
if jq . data/level-complete.json > /dev/null 2>&1; then
    test_pass "JSON valide"
else
    test_fail "JSON invalide"
fi

# Test 3: Vérifier les propriétés obligatoires
test_start "Propriétés obligatoires de level-complete.json"
REQUIRED_PROPS=("mapFile" "gridSize" "startPos" "challenges" "narrativeTree")
MISSING=()

for prop in "${REQUIRED_PROPS[@]}"; do
    if ! jq -e ".$prop" data/level-complete.json > /dev/null 2>&1; then
        MISSING+=("$prop")
    fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
    test_pass "Toutes les propriétés présentes"
else
    test_fail "Propriétés manquantes: ${MISSING[*]}"
fi

# Test 4: Vérifier que narrativeTree a des nœuds
test_start "narrativeTree contient des nœuds"
NODE_COUNT=$(jq '.narrativeTree.nodes | length' data/level-complete.json)
if [ "$NODE_COUNT" -gt 0 ]; then
    test_pass "$NODE_COUNT nœud(s) trouvé(s)"
else
    test_fail "Aucun nœud dans narrativeTree"
fi

# Test 5: Vérifier challenges
test_start "Challenges présents"
CHALLENGE_COUNT=$(jq '.challenges | length' data/level-complete.json)
if [ "$CHALLENGE_COUNT" -gt 0 ]; then
    test_pass "$CHALLENGE_COUNT challenge(s) trouvé(s)"
else
    test_fail "Aucun challenge"
fi

# Test 6: Correspondance IDs challenges <-> nœuds
test_start "Correspondance IDs challenges <-> nœuds"
CHALLENGE_IDS=$(jq -r '.challenges[].id' data/level-complete.json | sort)
NODE_IDS=$(jq -r '.narrativeTree.nodes[].id' data/level-complete.json | sort)

if [ "$CHALLENGE_IDS" == "$NODE_IDS" ]; then
    test_pass "IDs correspondent parfaitement"
else
    test_fail "IDs ne correspondent pas"
    test_info "Challenge IDs: $CHALLENGE_IDS"
    test_info "Node IDs: $NODE_IDS"
fi

# Test 7: Vérifier que challenges.json existe (fallback)
test_start "Fichier challenges.json existe (fallback)"
if [ -f "data/challenges.json" ]; then
    test_pass "challenges.json trouvé"
else
    test_fail "challenges.json absent (fallback ne fonctionnera pas)"
fi

# Test 8: Valider JSON challenges.json
test_start "Validation JSON de challenges.json"
if jq . data/challenges.json > /dev/null 2>&1; then
    test_pass "JSON valide"
else
    test_fail "JSON invalide"
fi

# Test 9: Vérifier level1.json (mécaniques)
test_start "Fichier level1.json existe"
if [ -f "data/level1.json" ]; then
    test_pass "level1.json trouvé"
else
    test_fail "level1.json absent"
fi

# Test 10: Valider mécaniques dans level1.json
test_start "Mécaniques présentes dans level1.json"
if jq -e '.mechanics' data/level1.json > /dev/null 2>&1; then
    CATA_MAX=$(jq -r '.mechanics.catastropheMax' data/level1.json)
    HEALTH_MAX=$(jq -r '.mechanics.healthMax' data/level1.json)
    test_pass "Mécaniques trouvées (catastropheMax: $CATA_MAX, healthMax: $HEALTH_MAX)"
else
    test_fail "Mécaniques absentes"
fi

echo ""

# ==========================================
# TESTS DE STRUCTURE
# ==========================================

echo -e "${YELLOW}=== TESTS DE STRUCTURE ===${NC}"
echo ""

# Test 11: Vérifier que chaque challenge a 4 outcomes
test_start "Tous les challenges ont 4 outcomes"
EXPECTED_OUTCOMES=("success_triumph" "success_narrow" "fail_narrow" "fail_catastrophic")
ALL_HAVE_4=true

CHALLENGE_COUNT=$(jq '.challenges | length' data/level-complete.json)
for i in $(seq 0 $((CHALLENGE_COUNT - 1))); do
    OUTCOME_COUNT=$(jq ".challenges[$i].outcomes | length" data/level-complete.json)
    if [ "$OUTCOME_COUNT" -ne 4 ]; then
        ALL_HAVE_4=false
        break
    fi
done

if [ "$ALL_HAVE_4" = true ]; then
    test_pass "Tous les challenges ont 4 outcomes"
else
    test_fail "Certains challenges n'ont pas 4 outcomes"
fi

# Test 12: Vérifier coordonnées des challenges
test_start "Tous les challenges ont des coordonnées valides"
ALL_COORDS_VALID=true

for i in $(seq 0 $((CHALLENGE_COUNT - 1))); do
    X=$(jq -r ".challenges[$i].coordinates.x" data/level-complete.json)
    Y=$(jq -r ".challenges[$i].coordinates.y" data/level-complete.json)

    if [ "$X" == "null" ] || [ "$Y" == "null" ]; then
        ALL_COORDS_VALID=false
        break
    fi
done

if [ "$ALL_COORDS_VALID" = true ]; then
    test_pass "Toutes les coordonnées sont valides"
else
    test_fail "Certaines coordonnées sont invalides"
fi

# Test 13: Vérifier triggerRadius
test_start "Tous les challenges ont un triggerRadius"
ALL_RADIUS_VALID=true

for i in $(seq 0 $((CHALLENGE_COUNT - 1))); do
    RADIUS=$(jq -r ".challenges[$i].triggerRadius" data/level-complete.json)

    if [ "$RADIUS" == "null" ] || [ "$RADIUS" -lt 1 ]; then
        ALL_RADIUS_VALID=false
        break
    fi
done

if [ "$ALL_RADIUS_VALID" = true ]; then
    test_pass "Tous les triggerRadius sont valides"
else
    test_fail "Certains triggerRadius sont invalides"
fi

# Test 14: Vérifier que chaque nœud a un nom
test_start "Tous les nœuds ont un nom"
ALL_NAMES_VALID=true

for i in $(seq 0 $((NODE_COUNT - 1))); do
    NAME=$(jq -r ".narrativeTree.nodes[$i].name" data/level-complete.json)

    if [ "$NAME" == "null" ] || [ -z "$NAME" ]; then
        ALL_NAMES_VALID=false
        break
    fi
done

if [ "$ALL_NAMES_VALID" = true ]; then
    test_pass "Tous les nœuds ont un nom"
else
    test_fail "Certains nœuds n'ont pas de nom"
fi

# Test 15: Vérifier que chaque nœud a une icône
test_start "Tous les nœuds ont une icône"
ALL_ICONS_VALID=true

for i in $(seq 0 $((NODE_COUNT - 1))); do
    ICON=$(jq -r ".narrativeTree.nodes[$i].icon" data/level-complete.json)

    if [ "$ICON" == "null" ] || [ -z "$ICON" ]; then
        ALL_ICONS_VALID=false
        break
    fi
done

if [ "$ALL_ICONS_VALID" = true ]; then
    test_pass "Tous les nœuds ont une icône"
else
    test_fail "Certains nœuds n'ont pas d'icône"
fi

echo ""

# ==========================================
# TESTS DES FICHIERS HTML
# ==========================================

echo -e "${YELLOW}=== TESTS DES FICHIERS HTML ===${NC}"
echo ""

# Test 16: Vérifier que index.html existe
test_start "Fichier index.html existe"
if [ -f "index.html" ]; then
    test_pass "index.html trouvé"
else
    test_fail "index.html absent"
fi

# Test 17: Vérifier que challenge-editor.html existe
test_start "Fichier challenge-editor.html existe"
if [ -f "challenge-editor.html" ]; then
    test_pass "challenge-editor.html trouvé"
else
    test_fail "challenge-editor.html absent"
fi

# Test 18: Vérifier que niveau-editor.html existe
test_start "Fichier niveau-editor.html existe"
if [ -f "niveau-editor.html" ]; then
    test_pass "niveau-editor.html trouvé"
else
    test_fail "niveau-editor.html absent"
fi

# Test 19: Vérifier que main.js existe
test_start "Fichier js/main.js existe"
if [ -f "js/main.js" ]; then
    test_pass "main.js trouvé"
else
    test_fail "main.js absent"
fi

# Test 20: Vérifier que main.js contient enrichChallengesWithNarrative
test_start "main.js contient enrichChallengesWithNarrative"
if grep -q "enrichChallengesWithNarrative" js/main.js; then
    test_pass "Fonction trouvée dans main.js"
else
    test_fail "Fonction absente de main.js"
fi

# Test 21: Vérifier que main.js charge level-complete.json
test_start "main.js charge level-complete.json"
if grep -q "level-complete.json" js/main.js; then
    test_pass "Chargement de level-complete.json détecté"
else
    test_fail "Chargement de level-complete.json non détecté"
fi

echo ""

# ==========================================
# RÉSUMÉ
# ==========================================

echo "========================================="
echo "📊 RÉSUMÉ DES TESTS"
echo "========================================="
echo -e "Total:    ${BLUE}$TOTAL${NC}"
echo -e "Réussis:  ${GREEN}$PASSED${NC}"
echo -e "Échoués:  ${RED}$FAILED${NC}"
echo "========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS ONT RÉUSSI !${NC}"
    exit 0
else
    echo -e "${RED}⚠️  $FAILED test(s) ont échoué${NC}"
    exit 1
fi
