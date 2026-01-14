# Changelog

## 2026-01-14 - Refactoring & Challenge JSON Improvements

### 🎯 Summary
- Refactored challenge.json format to be self-sufficient (no longer requires level1.json)
- Added comprehensive validation for challenge consistency in the editor
- Fixed missing healthEffects in existing challenges
- Improved error handling and data structure consistency

### ✨ Features Added

#### Editor (editor.html)
1. **Validation System**: Added `validateChallenges()` function that checks:
   - Required fields (name, dialogue_preview, coordinates)
   - Complete outcomes (all 4 outcome types must be defined)
   - **Critical**: healthEffects must be present and complete for all challenges
   - Provides clear error messages for missing data

2. **Export Improvements**:
   - Exports now include full `mechanics` object with:
     - `catastropheMax`: Maximum catastrophe level
     - `healthMax`: Maximum player health
     - `cards`: All card definitions (success_narrow, success_triumph, fail_narrow, fail_catastrophic)
   - Validation runs before export/copy - prevents exporting invalid data
   - Shows warnings for incomplete data (non-blocking)
   - Shows errors for critical missing data (blocks export)

3. **Import Improvements**:
   - Supports both new format (with mechanics) and legacy format (without mechanics)
   - Auto-validates imported data and shows validation results
   - Better error messages

#### Game Loader (js/main.js)
1. **Standalone challenges.json Support**:
   - If challenges.json contains `mechanics` object, uses it as sole data source
   - No longer requires level1.json when challenges.json is complete
   - Falls back to legacy mode if challenges.json lacks mechanics
   - Better error messages for missing files

2. **Three Loading Modes**:
   - **Standalone**: Complete challenges.json with mechanics (preferred)
   - **Legacy**: challenges.json without mechanics + level1.json fallback
   - **Fallback**: level1.json only (when challenges.json doesn't exist)

#### Data Files
1. **challenges.json**: Updated to include:
   - Full `mechanics` object
   - `healthEffects` for all challenges (was missing!)
   - Now self-sufficient and validates correctly

### 🔧 Technical Changes

#### New challenges.json Structure
```json
{
  "mapFile": "assets/lastdunes1.jpg",
  "gridSize": 40,
  "startPos": {"x": 16, "y": 25},
  "mechanics": {
    "catastropheMax": 3,
    "healthMax": 3,
    "cards": { /* card definitions */ }
  },
  "walls": [],
  "water": [],
  "objects": [],
  "challenges": [
    {
      "id": "...",
      "healthEffects": {  /* NOW REQUIRED */
        "success_triumph": 0,
        "success_narrow": 0,
        "fail_narrow": -1,
        "fail_catastrophic": -2
      }
      /* ... other fields ... */
    }
  ]
}
```

### 🗑️ Removed/Deprecated
- Removed dependency on level1.json for challenges.json-based levels
- Removed `maxHealth` at root level (now in `mechanics.healthMax`)

### ✅ Testing
- ✅ JSON syntax validation passed
- ✅ JavaScript syntax validation passed
- ✅ Backwards compatibility maintained (legacy format still works)

### 📝 Notes
- **Breaking Change**: Challenges exported from the editor now use the new format
- **Migration Path**: Old challenges.json files will still work but trigger legacy mode
- **Recommendation**: Re-export existing challenges through the editor to get validation benefits
- level1.json is kept as fallback for backwards compatibility but is no longer the default dependency

### 🎓 For Developers
When creating new challenges:
1. Use the editor (editor.html) to create challenges
2. Fill in ALL fields, especially:
   - Health effects for all 4 outcomes
   - All 4 outcome texts
   - Dialogue preview
3. The editor will validate before export
4. Export creates a complete, self-sufficient challenges.json

### 🐛 Bugs Fixed
- Fixed missing healthEffects in challenges (game breaking!)
- Fixed inconsistent data structure between level1.json and challenges.json
- Fixed silent failures when challenges were missing required fields
