@echo off
REM Obfusque script-modern.js en script-modern.obf.js avec options avancées
javascript-obfuscator script-modern.js --output script-modern.obf.js --compact true --self-defending true --control-flow-flattening true
pause
