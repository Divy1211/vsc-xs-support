# Change Log

## Released v1.0.12 on 04-04-2021

Fixed typo in `xsGetFunctionID`

## Released v1.0.11 on 03-04-2021

Added new functions and constants from the PUP

01. \+ `cAttrSetStackingResearchCap`
02. \+ `cFogFlag`

## Released v1.0.10 on 16-02-2021

Added new functions and constants from the update


### New Functions
01. \+ `xsCreateFile`
02. \+ `xsOpenFile`
03. \+ `xsWriteString`
04. \+ `xsWriteInt`
05. \+ `xsWriteFloat`
06. \+ `xsWriteVector`
07. \+ `xsReadString`
08. \+ `xsReadInt`
09. \+ `xsReadFloat`
10. \+ `xsReadVector`
11. \+ `xsSetFilePosition`
12. \+ `xsOffsetFilePosition`
13. \+ `xsCloseFile`

### New Constants
1. \+ `cOffsetString`   (0)
2. \+ `cOffsetInterger` (1)
3. \+ `cOffsetFloat`    (2)
4. \+ `cOffsetVector`   (3)

## Released v1.0.9 on 07-10-2021

Added & Renamed new constants from the update
### Resource consts
01. cAttributeMaintence -> cAttributeMaintenance           (33)
02. cAttributeUnused0   -> cAttributeFeudalTownCenterLimit (218)
03. cAttributeUnused3   -> cAttributeMonumentFoodTrickle   (221)
04. cAttributeUnused4   -> cAttributeMonumentWoodTrickle   (222)
05. cAttributeUnused5   -> cAttributeMonumentStoneTrickle  (223)
06. cAttributeUnused6   -> cAttributeMonumentGoldTrickle   (224)
07. cAttributeUnused7   -> cAttributeRelicFoodRate         (225)
08. cAttriubteAdd       -> cAttributeAdd                   (1)
09. \+ cAttributeFlemishMilitiaPop           (235)
10. \+ cAttributeGoldFarmingProductivity     (236)
11. \+ cAttributeFolwarkCollectionAmount     (237)
12. \+ cAttributeFolwarkCollectionType       (238)
13. \+ cAttributeBuildingId                  (239)
14. \+ cAttributeUnitsConverted              (240)
15. \+ cAttributeStoneGoldMiningProductivity (241)
16. \+ cAttributeWorkshopFoodTrickle         (242)
17. \+ cAttributeWorkshopWoodTrickle         (243)
18. \+ cAttributeWorkshopStoneTrickle        (244)
19. \+ cAttributeWorkshopGoldTrickle         (245)
20. \+ cPoles     (38)
21. \+ cBohemians (39)

## Released v1.0.8 on 22-09-2021

Fixed escaped backslash followed by a double quote not detecting the end of a string

## Released v1.0.7 on 02-09-2021

Added usage docstring for keywords `static`, `infiniteLoopLimit`, `infiniteRecursionLimit`, `mutable`
Updated usage docstring for `class` keyword
Fixed highlighting for keyword `infiniteRecursionLimit`

## Released v1.0.6 on 26-08-2021

Fixed name of `xsGenerateRandomNumberLH` from `xsGenerateRandomNumberHL`

## Released v1.0.5 on 12-08-2021

- Added 3 new RNG functions:
1. `int xsGenerateRandomNumber()`
2. `int xsGenerateRandomNumberHL(int low, int high)`
3. `int xsGenerateRandomNumberMax(int max)`

## Released v1.0.4 on 5-08-2021

- Fixed Spelling Error in `cAttributeRevealInitialType`

## Released v1.0.3 on 2-08-2021

- Improved docstring for function `xsAddRuntimeEvent`

## Released v1.0.2 on 16-07-2021

- Added two missing constants

## Released v1.0.1 on 16-07-2021

- Fixed Dynamic function completion providers not scoping correctly

## Released v1.0.0 on 15-07-2021

- Added Semantic Highlighting for function parameters and constants
- Improved Code Completion suggestions. Added the docstrings of every function and constant to its suggestion.
- Added Dynamic Code Completion suggestions based on the code the user has written.
- Added Docstrings on hover for known functions and constants
- Added Dynamic info on hover based on the code the user has written. Example: Hovering over a rule groupname will show all the rules in that group
- Added the ability to ctrl+click a variable, function or rulename to go to its definition.
- All of the dynamic code completion and info provider features will now also check for functions variables and rules in included files!**

**Note: Currently, the way that the plugin searches for included files is relative to the path of the source file. HOWEVER, this is not how they are searched for in AoE2DE. AoE2DE always searches for them in the specific `xs` folders of the mods a user has and the `xs` folders of their userprofile and game directories.

Suggestion: Use relative file paths for included files while developing in vsc to get the plugin's imported file features to work, change the paths on testing in DE.

- Inbuilt functions are no longer highlighted differently from user defined functions.
    
## Released v0.0.3 on 22-03-2021

- Fixed xsEffectAmount auto-completion not selecting the last argument for player number in the tabbing order.

## Released v0.0.2 on 13-03-2021

- Added Missing Constants
    cInvalidVector
    cOriginVector
    cActivationTime
- Inbuilt functions are now highlighted differently from user defined functions if the theme supports it

## Released v0.0.1 on 09-03-2021

- Initial release