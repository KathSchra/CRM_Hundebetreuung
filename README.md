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
![kunden-1](https://github.com/KathSchra/CRM_Hundebetreuung/assets/132889946/344cf68b-3623-42e4-b55a-5f912db944c6)

Im Bereich "Kunden" können alle gängigen **Daten der Besitzer angelegt, geändert und gelöscht** werden.
Jeder Kunde bekommt automatisch eine **fortlaufende Kundennummer** zugewiesen, die nicht über das Frontend geändert werden kann.
Außerdem können unter jedem Besitzer mehrere Hunde angelegt werden. <br>
Dazu wird für jeden Datensatz eine eigene **uuidv4** im Backend generiert und als **Primär- oder ggf. Fremdschlüssel** in der Datenbank genutzt.
Wird ein Kunde gelöscht, werden zeitgleich alle zugehörigen Hunde ebenfalls gelöscht. Eine **zusätzliche Abfrage** vor dem Löschen **verhindert ein versehentliches Entfernen** der Daten


## Hunde verwalten
![hunde](https://github.com/KathSchra/CRM_Hundebetreuung/assets/132889946/d08e0cae-49d4-44d7-a48f-1926f8f8161f)

Im Bereich "Hunde" kann man sich einen schnellen **Überblick über alle angemeldeten Hunde** verschaffen und deren **Daten ändern oder löschen**. Die Daten des jeweiligen Besitzers werden ebenfalls angezeigt, können aber nicht bearbeitet werden.


## Betreuung planen
![betreuung](https://github.com/KathSchra/CRM_Hundebetreuung/assets/132889946/58d07e48-4528-4dc1-b000-5decf2044ef3)

Im Bereich "Betreuung" werden alle Hunde, die einen **Aufenthaltszeitraum** zugewiesen bekommen haben, in **chronologischer Reihenfolge** angezeigt. So kann man schnell erfassen **welcher Hund wann zur Betreuung** kommt. <br>
Außerdem kann der Aufenthaltszeitraum eines Hundes geändert werden.
