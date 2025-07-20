# Change Log

## Released v1.0.21 on 20-07-2025

1. Changed capitalization of `ID` to `Id` in parameter names
2. Consistencified `unit` vs `object` in function and parameter names where relevant
3. Changed parameter names from `objectId` to `objectOrClassId` where relevant
4. Fixed `main` function being missing from functions list

## Released v1.0.20 on 20-07-2025

1. Fixed typo in function parameter names

## Released v1.0.19 on 20-07-2025

### New Constants

1. \+ `cShu`
2. \+ `cWu`
3. \+ `cWei`
4. \+ `cJurchens`
5. \+ `cKhitans`

6. \+ `cAttrMulTime`

7. \+ `cSpecialAbility`
8. \+ `cIdleAttackGraphic`
9. \+ `cHeroGlowGraphic`
10. \+ `cGarrisonGraphic`
11. \+ `cConstructionGraphic`
12. \+ `cSnowGraphic`
13. \+ `cDestructionGraphic`
14. \+ `cDestructionRubbleGraphic`
15. \+ `cResearchingGraphic`
16. \+ `cResearchCompletedGraphic`
17. \+ `cDamageGraphic`
18. \+ `cSelectionSound`
19. \+ `cSelectionSoundEvent`
20. \+ `cDyingSound`
21. \+ `cDyingSoundEvent`
22. \+ `cTrainSound`
23. \+ `cTrainSoundEvent`
24. \+ `cDamageSound`
25. \+ `cDamageSoundEvent`

26. \+ `cAttack2Graphic`
27. \+ `cCommandSound`
28. \+ `cCommandSoundEvent`
29. \+ `cMoveSound`
30. \+ `cMoveSoundEvent`
31. \+ `cConstructionSound`
32. \+ `cConstructionSoundEvent`
33. \+ `cTransformSound`
34. \+ `cTransformSoundEvent`
35. \+ `cRunPattern`
36. \+ `cInterfaceKind`
37. \+ `cCombatLevel`
38. \+ `cInteractionMode`
39. \+ `cMinimapMode`
40. \+ `cTrailingUnit`
41. \+ `cTrailMode`
42. \+ `cTrailDensity`
43. \+ `cProjectileGraphicDisplacementX`
44. \+ `cProjectileGraphicDisplacementY`
45. \+ `cProjectileGraphicDisplacementZ`
46. \+ `cProjectileSpawningAreaWidth`
47. \+ `cProjectileSpawningAreaLength`
48. \+ `cProjectileSpawningAreaRandomness`
49. \+ `cDamageGraphicsEntryMod`
50. \+ `cDamageGraphicsTotalNum`
51. \+ `cDamageGraphicPercent`
52. \+ `cDamageGraphicApplyMode`

53. \+ `cGoldFishClass`
54. \+ `cLandMineClass`

55. \+ `cAttributeMilitaryFoodTrickle`
56. \+ `cAttributePastureFoodAmount`
57. \+ `cAttributePastureAnimalCount`
58. \+ `cAttributePastureHerderCount`
59. \+ `cAttributeDisableAnimalDecay`
60. \+ `cAttributeHerdingFoodProductivity`
61. \+ `cAttributeShepherdingFoodProductivity`
62. \+ `cAttributeChoppingFoodProductivity`

63. \+ `cDamageClassInfantry`
64. \+ `cDamageClassCapitalShips`
65. \+ `cDamageClassPierce`
66. \+ `cDamageClassMelee`
67. \+ `cDamageClassElephantUnits`
68. \+ `cDamageClassCavalry`
69. \+ `cDamageClassAllBuildings`
70. \+ `cDamageClassStoneDefense`
71. \+ `cDamageClassPredatorAnimals`
72. \+ `cDamageClassArchers`
73. \+ `cDamageClassShips`
74. \+ `cDamageClassRams`
75. \+ `cDamageClassTrees`
76. \+ `cDamageClassUniqueUnits`
77. \+ `cDamageClassSiegeWeapons`
78. \+ `cDamageClassStandardBuildings`
79. \+ `cDamageClassWallsAndGates`
80. \+ `cDamageClassGunpowderUnits`
81. \+ `cDamageClassBoars`
82. \+ `cDamageClassMonks`
83. \+ `cDamageClassCastles`
84. \+ `cDamageClassSpearmen`
85. \+ `cDamageClassCavalryArchers`
86. \+ `cDamageClassShockInfantry`
87. \+ `cDamageClassCamelUnits`
88. \+ `cDamageClassCondottieri`
89. \+ `cDamageClassFishingShips`
90. \+ `cDamageClassMamelukes`
91. \+ `cDamageClassHeroesAndKings`
92. \+ `cDamageClassHeavySiege`
93. \+ `cDamageClassSkirmishers`
94. \+ `cDamageClassRoyalHeirs`

95. \+ `cTaskAttrWorkValue1`
96. \+ `cTaskAttrWorkValue2`
97. \+ `cTaskAttrWorkRange`
98. \+ `cTaskAttrWorkFlag2`
99. \+ `cTaskAttrSearchWaitTime`
100. \+ `cTaskAttrCombatLevelFlag`
101. \+ `cTaskAttrOwnerType`
102. \+ `cTaskAttrTerrain`
103. \+ `cTaskAttrResourceIn`
104. \+ `cTaskAttrProductivityResource`
105. \+ `cTaskAttrResourceOut`
106. \+ `cTaskAttrUnusedResource`
107. \+ `cTaskAttrMovingGraphic`
108. \+ `cTaskAttrProceedingGraphic`
109. \+ `cTaskAttrWorkingGraphic`
110. \+ `cTaskAttrCarryingGraphic`
111. \+ `cTaskAttrGatheringSound`
112. \+ `cTaskAttrGatheringSoundEvent`
113. \+ `cTaskAttrGatheringSoundInt32`
114. \+ `cTaskAttrDepositSound`
115. \+ `cTaskAttrDepositSoundEvent`
116. \+ `cTaskAttrDepositSoundInt32`
117. \+ `cTaskAttrAutoSearch`
118. \+ `cTaskAttrCarryCheck`
119. \+ `cTaskAttrBuildingPick`
120. \+ `cTaskAttrGatherType`
121. \+ `cTaskAttrEnableTargeting`
122. \+ `cTaskAttrEnabled`

123. \+ `cTaskTypeMoveTo`
124. \+ `cTaskTypeFollow`
125. \+ `cTaskTypeGarrison`
126. \+ `cTaskTypeExplore`
127. \+ `cTaskTypeGatherRebuild`
128. \+ `cTaskTypeGraze`
129. \+ `cTaskTypeCombat`
130. \+ `cTaskTypeShoot`
131. \+ `cTaskTypeAttack`
132. \+ `cTaskTypeFly`
133. \+ `cTaskTypeUnloadBoatLike`
134. \+ `cTaskTypeGuard`
135. \+ `cTaskTypeUnloadOverWall`
136. \+ `cTaskTypeMake`
137. \+ `cTaskTypeBuild`
138. \+ `cTaskTypeMakeUnit`
139. \+ `cTaskTypeMakeTech`
140. \+ `cTaskTypeConvert`
141. \+ `cTaskTypeHeal`
142. \+ `cTaskTypeRepair`
143. \+ `cTaskTypeGetAutoConverted`
144. \+ `cTaskTypeDiscoveryArtifact`
145. \+ `cTaskTypeHunt`
146. \+ `cTaskTypeTrade`
147. \+ `cTaskTypeGenerateWonderVictory`
148. \+ `cTaskTypeDeselectWhenTasked`
149. \+ `cTaskTypeLootGather`
150. \+ `cTaskTypeHousing`
151. \+ `cTaskTypePack`
152. \+ `cTaskTypeUnpackAndAttack`
153. \+ `cTaskTypeOffMapTrade`
154. \+ `cTaskTypePickupUnit`
155. \+ `cTaskTypeChargeAttack`
156. \+ `cTaskTypeTransformUnit`
157. \+ `cTaskTypeKidnapUnit`
158. \+ `cTaskTypeDepositUnit`
159. \+ `cTaskTypeShear`
160. \+ `cTaskTypeGenerateResources`
161. \+ `cTaskTypeMovementDamage`
162. \+ `cTaskTypeMovableDropsite`
163. \+ `cTaskTypeLoot`
164. \+ `cTaskTypeAura`
165. \+ `cTaskTypeExtraSpawn`
166. \+ `cTaskTypeStinger`
167. \+ `cTaskTypeHPTransform`
168. \+ `cTaskTypeHPModifier`

169. \+ `cTechStateNotRead`
170. \+ `cTechStateReady`
171. \+ `cTechStateQueued`
172. \+ `cTechStateResearching`
173. \+ `cTechStateDone`
174. \+ `cTechStateDisabled`
175. \+ `cTechStateInvalid`

176. `cAttack2Graphic = 131` (Previously incorrectly set to 81)

### New Functions

1. \+ `bitCastToFloat`
2. \+ `bitCastToInt`
3. \+ `xsResetTaskAmount`
4. \+ `xsGetTurn`
5. \+ `xsGetPlayerUnitIds`
6. \+ `xsGetUnitAttribute`
7. \+ `xsDoesUnitExist`
8. \+ `xsGetUnitOwner`
9. \+ `xsGetPlayerName`
10. \+ `xsGetUnitPosition`
11. \+ `xsGetUnitName`
12. \+ `xsGetUnitTargetUnitId`
13. \+ `xsGetUnitMoveTarget`
14. \+ `xsGetObjectName`
15. \+ `xsIsObjectAvailable`
16. \+ `xsGetTechName`
17. \+ `xsGetTechState`

## Released v1.0.18 on 08-07-2025

1. Fixed missing index in for-each snippets

## Released v1.0.17 on 07-07-2025

1. Clarified parameter names in functions
2. Fixed default parameter requirements in functions
3. Added clarifications to function descriptions

### New Constants

1. \+ `cStoneAge`
2. \+ `cToolAge`
3. \+ `cBronzeAge`
4. \+ `cIronAge`

5. \+ `cRomans`
6. \+ `cArmenians`
7. \+ `cGeorgians`
8. \+ `cAchaemenids`
9. \+ `cAthenians`
10. \+ `cSpartans`

11. \+ `cAoeEgyptians`
12. \+ `cAoeGreeks`
13. \+ `cAoeBabylonians`
14. \+ `cAoeAssyrians`
15. \+ `cAoeMinoans`
16. \+ `cAoeHittites`
17. \+ `cAoePhoenicians`
18. \+ `cAoeSumerians`
19. \+ `cAoePersians`
20. \+ `cAoeShang`
21. \+ `cAoeYamato`
22. \+ `cAoeChoson`
23. \+ `cAoeRomans`
24. \+ `cAoeCarthaginians`
25. \+ `cAoePalmyrans`
26. \+ `cAoeMacedonians`
27. \+ `cAoeLacViet`

28. `cEnableTech` -> `cSpawnUnit`
29. `cGaiaEnableTech` -> `cGaiaSpawnUnit`

30. \+ `cAttributeResearch`
31. \+ `cAttrSetState`

32. \+ `cCanBeBuiltOn`
32. \+ `cFoundationTerrain`

33. \+ `cAttackGraphic`
34. \+ `cStandingGraphic`
35. \+ `cStanding2Graphic`
36. \+ `cDyingGraphic`
37. \+ `cUndeadGraphic`
38. \+ `cWalkingGraphic`
39. \+ `cRunningGraphic`
40. \+ `cSpecialGraphic`
41. \+ `cObstructionType`
42. \+ `cBlockageClass`
43. \+ `cSelectionEffect`
44. \+ `cAttack2Graphic` (This constant is currently incorrect to 81, should be 131)
45. \+ `cMinConversionTimeMod`
46. \+ `cMaxConversionTimeMod`
47. \+ `cConversionChanceMod`
48. \+ `cFormationCategory`
49. \+ `cAreaDamage`
50. \+ `cDamageReflection`
51. \+ `cFriendlyFireDamage`
52. \+ `cRegenerationHpPercent`
53. \+ `cButtonIconId`
54. \+ `cShortTooltipId`
55. \+ `cExtendedTooltipId`
56. \+ `cHotkeyAction`
57. \+ `cChargeProjectileUnit`
58. \+ `cAvailableFlag`
59. \+ `cDisabledFlag`
60. \+ `cAttackPriority`
61. \+ `cInvulnerabilityLevel`
62. \+ `cGarrisonFirepower`

63.  `cAttributeElevationBonusLoweer` -> `cAttributeElevationBonusLower`

64. `cAttributeUnused1` ->  `cAttributeFishingProductivity`
65. `cAttributeUnused2` ->  `cAttributeUnused220`
66. `cAttributeExtraElephantConversionResist` ->  `cAttributeCivNameOverride`

67. \+ `cAttributeChoppingGoldProductivity`
68. \+ `cAttributeForagingWoodProductivity`
69. \+ `cAttributeHuntingProductivity`
70. \+ `cAttributeTechnologyRewardEffect`
71. \+ `cAttributeUnitRepairCost`
72. \+ `cAttributeBuildingRepairCost`
73. \+ `cAttributeElevationDamageHigher`
74. \+ `cAttributeElevationDamageLower`
75. \+ `cAttributeInfantryKillReward`
76. \+ `cAttributeMilitaryCanConvert`
77. \+ `cAttributeMilitaryConversionRangeAdj`
78. \+ `cAttributeMilitaryConversionChance`
79. \+ `cAttributeMilitaryConversionRechargeRate`
80. \+ `cAttributeSpawnStayInside`
81. \+ `cAttributeCavalryKillReward`
82. \+ `cAttributeTriggerSharedVisibility`
83. \+ `cAttributeTriggerSharedExploration`

### Updated Constants

84. \+ `cAttributeGaiaKills = 300`
85. \+ `cAttributePlayer1Kills = 301`
86. \+ `cAttributePlayer2Kills = 302`
87. \+ `cAttributePlayer3Kills = 303`
88. \+ `cAttributePlayer4Kills = 304`
89. \+ `cAttributePlayer5Kills = 305`
90. \+ `cAttributePlayer6Kills = 306`
91. \+ `cAttributePlayer7Kills = 307`
92. \+ `cAttributePlayer8Kills = 308`
93. \+ `cAttributeKillsByGaia = 325`
94. \+ `cAttributeKillsByPlayer1 = 326`
95. \+ `cAttributeKillsByPlayer2 = 327`
96. \+ `cAttributeKillsByPlayer3 = 328`
97. \+ `cAttributeKillsByPlayer4 = 329`
98. \+ `cAttributeKillsByPlayer5 = 330`
99. \+ `cAttributeKillsByPlayer6 = 331`
100. \+ `cAttributeKillsByPlayer7 = 332`
101. \+ `cAttributeKillsByPlayer8 = 333`
102. \+ `cAttributeGaiaRazings = 350`
103. \+ `cAttributePlayer1Razings = 351`
104. \+ `cAttributePlayer2Razings = 352`
105. \+ `cAttributePlayer3Razings = 353`
106. \+ `cAttributePlayer4Razings = 354`
107. \+ `cAttributePlayer5Razings = 355`
108. \+ `cAttributePlayer6Razings = 356`
109. \+ `cAttributePlayer7Razings = 357`
110. \+ `cAttributePlayer8Razings = 358`
111. \+ `cAttributeRazingsByGaia = 375`
112. \+ `cAttributeRazingsByPlayer1 = 376`
113. \+ `cAttributeRazingsByPlayer2 = 377`
114. \+ `cAttributeRazingsByPlayer3 = 378`
115. \+ `cAttributeRazingsByPlayer4 = 379`
116. \+ `cAttributeRazingsByPlayer5 = 380`
117. \+ `cAttributeRazingsByPlayer6 = 381`
118. \+ `cAttributeRazingsByPlayer7 = 382`
119. \+ `cAttributeRazingsByPlayer8 = 383`
120. \+ `cAttributeGaiaKillValue = 400`
121. \+ `cAttributePlayer1KillValue = 401`
122. \+ `cAttributePlayer2KillValue = 402`
123. \+ `cAttributePlayer3KillValue = 403`
124. \+ `cAttributePlayer4KillValue = 404`
125. \+ `cAttributePlayer5KillValue = 405`
126. \+ `cAttributePlayer6KillValue = 406`
127. \+ `cAttributePlayer7KillValue = 407`
128. \+ `cAttributePlayer8KillValue = 408`
129. \+ `cAttributeGaiaRazingValue = 425`
130. \+ `cAttributePlayer1RazingValue = 426`
131. \+ `cAttributePlayer2RazingValue = 427`
132. \+ `cAttributePlayer3RazingValue = 428`
133. \+ `cAttributePlayer4RazingValue = 429`
134. \+ `cAttributePlayer5RazingValue = 430`
135. \+ `cAttributePlayer6RazingValue = 431`
136. \+ `cAttributePlayer7RazingValue = 432`
137. \+ `cAttributePlayer8RazingValue = 433`
138. \+ `cAttributeGaiaTribute = 450`
139. \+ `cAttributePlayer1Tribute = 451`
140. \+ `cAttributePlayer2Tribute = 452`
141. \+ `cAttributePlayer3Tribute = 453`
142. \+ `cAttributePlayer4Tribute = 454`
143. \+ `cAttributePlayer5Tribute = 455`
144. \+ `cAttributePlayer6Tribute = 456`
145. \+ `cAttributePlayer7Tribute = 457`
146. \+ `cAttributePlayer8Tribute = 458`
147. \+ `cAttributeTributeFromGaia = 475`
148. \+ `cAttributeTributeFromPlayer1 = 476`
149. \+ `cAttributeTributeFromPlayer2 = 477`
150. \+ `cAttributeTributeFromPlayer3 = 478`
151. \+ `cAttributeTributeFromPlayer4 = 479`
152. \+ `cAttributeTributeFromPlayer5 = 480`
153. \+ `cAttributeTributeFromPlayer6 = 481`
154. \+ `cAttributeTributeFromPlayer7 = 482`
155. \+ `cAttributeTributeFromPlayer8 = 483`

### New Functions

1. \+ `xsCeilToInt`

2. \+ `xsGetVictoryPlayerForSecondaryGameMode`
3. \+ `xsGetVictoryTimeForSecondaryGameMode`
4. \+ `xsGetVictoryCondition`
5. \+ `xsGetVictoryConditionForSecondaryGameMode`

6. \+ `xsObjectHasAction`
7. \+ `xsGetObjectAttribute`

8. \+ `xsTaskAmount`
9. \+ `xsTask`
10. \+ `xsRemoveTask`

11. \+ `xsGetGoal`
12. \+ `xsGetStrategicNumber`
13. \+ `xsSetGoal`
14. \+ `xsSetStrategicNumber`

## Released v1.0.16 on 29-06-2022

Fixed typo in monk with relic class constant

## Released v1.0.15 on 13-05-2022

### New Constants
1. \+ `cStandardVictory`
2. \+ `cWonderVictory`
3. \+ `cRelicVictory`
4. \+ `cKingOfTheHillVictory`

### New Functions
1. \+ `xsGetFilePosition`
2. \+ `xsGetDataTypeSize`
3. \+ `xsGetFileSize`
4. \+ `xsGetObjectCount`
5. \+ `xsGetObjectCountTotal`
6. \+ `xsGetVictoryPlayerForSecondaryGameMode`
7. \+ `xsGetVictoryTimeForSecondaryGameMode`
8. \+ `xsGetVictoryCondition`
9. \+ `xsGetVictoryConditionForSecondaryGameMode`

## Released v1.0.14 on 08-05-2022

### New constants
01. \+ `cDravidians`
02. \+ `cBengalis`
03. \+ `cGurjaras`

04. \+ `cAttrSetHotkey`

05. \+ `cOcclusionMode`
06. \+ `cGarrisonType`
07. \+ `cUnitSizeZ`
08. \+ `cTraits`
09. \+ `cTraitPiece`
10. \+ `cMaxCharge`
11. \+ `cRechargeRate`
12. \+ `cChargeEvent`
13. \+ `cChargeType`
14. \+ `cCombatAbility`
15. \+ `cAttackDispersion`
16. \+ `cSecondaryProjectileUnit`
17. \+ `cBloodUnitId`
18. \+ `cHitMode`
19. \+ `cVanishMode`
20. \+ `cProjectileArc`
21. \+ `cPopulation`

22. \+ `cAttributeUnitsValueTotal`
23. \+ `cAttributeBuildingsValueTotal`
24. \+ `cAttributeVillagersCreatedTotal`
25. \+ `cAttributeVillagersIdlePeriodsTotal`
26. \+ `cAttributeVillagersIdleSecondsTotal`
27. \+ `cAttributeTradeFoodPercent`
28. \+ `cAttributeTradeWoodPercent`
29. \+ `cAttributeTradeStonePercent`
30. \+ `cAttributeLivestockFoodProductivity`
31. \+ `cAttributeSpeedUpBuildingType`
32. \+ `cAttributeSpeedUpBuildingRange`
33. \+ `cAttributeSpeedUpPercentage`
34. \+ `cAttributeSpeedUpObjectType`
35. \+ `cAttributeSpeedUpEffectType`
36. \+ `cAttributeSpeedUpSecondaryEffectType`
37. \+ `cAttributeSpeedUpSecondaryPercentage`
38. \+ `cAttributeExtraElephantConvertResist`
39. \+ `cAttributeStartingScoutID`
40. \+ `cAttributeRelicWoodRate`
41. \+ `cAttributeRelicStoneRate`

42. `cAttributeBerserkerHealTimer` -> `cAttributeNoDropsiteFarmers` (96)
43. `cAttributeUnused0` -> `cAttributeFeudalTownCenterLimit` (218)

## Released v1.0.13 on 07-05-2022

Fixed typo in `xsEffectAmount` parameters

## Released v1.0.12 on 04-04-2022

Fixed typo in `xsGetFunctionID`
Fixed typo in `xsSetFilePosition` parameters

## Released v1.0.11 on 03-04-2022

Added new functions and constants from the PUP

01. \+ `cAttrSetStackingResearchCap`
02. \+ `cFogFlag`

## Released v1.0.10 on 16-02-2022

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