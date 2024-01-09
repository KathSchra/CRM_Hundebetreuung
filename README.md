# Hinweise

Bitte zu Beginn **npm i** ausführen und via **npm run dev** die Seite starten.

ggf. DB Browser SQLite installieren, um die Datenbank gesondert anzuschauen.
https://sqlitebrowser.org/dl/


## Verwendete Tools:

- Astro
- SolidJS
- Tailwind CSS
- daisyUi
- betterSqlite
- Visual Studio Code

## Trailer
Trailer-Video https://www.youtube.com/watch?v=sdRVOgtNGJM


## Kunden verwalten
![kunden](https://github.com/KathSchra/Kundensystem_Hundeschule/assets/132889946/bd242fb2-0a5c-4aae-9478-c7aebb8d5cdc)

Im Bereich "Kunden" können alle gängigen **Daten der Besitzer angelegt, geändert und gelöscht** werden.
Jeder Kunde bekommt automatisch eine **fortlaufende Kundennummer** zugewiesen, die nicht über das Frontend geändert werden kann.
Außerdem können unter jedem Besitzer mehrere Hunde angelegt werden. <br>
Dazu wird für jeden Datensatz eine eigene **uuidv4** im Backend generiert und als **Primär- oder ggf. Fremdschlüssel** in der Datenbank genutzt.
Wird ein Kunde gelöscht, werden zeitgleich alle zugehörigen Hunde ebenfalls gelöscht. Eine **zusätzliche Abfrage** vor dem Löschen **verhindert ein versehentliches Entfernen** der Daten


## Hunde verwalten
![hunde](https://github.com/KathSchra/Kundensystem_Hundeschule/assets/132889946/f76a9120-31b1-4e7e-80d0-7872f48a6580)

Im Bereich "Hunde" kann man sich einen schnellen **Überblick über alle angemeldeten Hunde** verschaffen und deren **Daten ändern oder löschen**. Die Daten des jeweiligen Besitzers werden ebenfalls angezeigt, können aber nicht bearbeitet werden.


## Betreuung planen
![betreuung](https://github.com/KathSchra/Kundensystem_Hundeschule/assets/132889946/c51bfe6e-1ce4-4728-b88d-d3786b1e022d)

Im Bereich "Betreuung" werden alle Hunde, die einen **Aufenthaltszeitraum** zugewiesen bekommen haben, in **chronologischer Reihenfolge** angezeigt. So kann man schnell erfassen **welcher Hund wann zur Betreuung** kommt. <br>
Außerdem kann der Aufenthaltszeitraum eines Hundes geändert werden.
