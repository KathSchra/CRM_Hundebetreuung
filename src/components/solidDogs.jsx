import { createSignal, createResource, For } from "solid-js";
import dayjs from 'dayjs';

export default function HundebetreuungServer(props) {
    let baseUrl = 'http://localhost:3000/api/'
    let imgDogUrl = 'http://localhost:3000/img/dog/'

    const fetchOwnerRessource = async () => { //läd die Daten aus der Datenbanktabelle owner
        let data = await fetch(baseUrl + 'owner');
        let json = await data.json();
        console.log("owner data fetched", json);
        return json.ownerObject.owner;
    }

    const [owner] = createResource(fetchOwnerRessource); // Array mit Daten zu Owner

    const [idDog, setIdDog] = createSignal("");
    const [name, setName] = createSignal("---");
    const [race, setRace] = createSignal("---");
    const [age, setAge] = createSignal("---");
    const [gender, setGender] = createSignal("---");
    const [castration, setCastration] = createSignal("---");
    const [chip, setChip] = createSignal("---");
    const [start, setStart] = createSignal("");
    const [end, setEnd] = createSignal("");
    const [ownerId, setOwnerId] = createSignal("");
    const [dogIdImg, setDogIdImg] = createSignal("")

    function formatDate(dateString) {
        const date = dayjs(dateString);
        return date.format('DD.MM.YYYY');
    }

    const [filterString, setFilterString] = createSignal("");
    const [selectedRow, setSelectedRow] = createSignal(null);
    const [changeDogModalOpen, setChangeDogModalOpen] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal(false);
    const [deleteMessageDog, setDeleteMessageDog] = createSignal(false);

    const fetchDogsRessource = async () => { //läd die Daten aus der Datenbanktabelle Dog
        let data = await fetch(baseUrl + 'dogs');
        let json = await data.json();
        console.log("dog data fetched", json);
        return json.dogObject.dogs;
    }
    const [dogs, { refetch: refetchDog }] = createResource(fetchDogsRessource); // Array mit Daten zu Dogs

    

    const uploadDogImage = async (idDog, file) => {
        console.log(idDog, file)
        const data = new FormData();
        data.append("image", file);
        data.append("type", file.type);
        data.append("name", file.name);
        data.append("id", idDog);
        const requestOptions = {
            method: 'POST',
            body: data
        };
        let response = await fetch(baseUrl + 'dogsImg', requestOptions);
        let json = await response.json();
        refetchDog();
    }


    {/*--------------- PUT und  DEL für Dog ---------------------------------------------------------------------------- */ }

    const putDog = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idDog(), name: name(), race: race(), age: age(), gender: gender(), castration: castration(), chip: chip(), start: start(), end: end(), ownerId: ownerId() })
        };
        let data = await fetch(baseUrl + 'dogs', requestOptions);
        let json = await data.json();
        console.log(json);
        refetchDog();
    }

    const deleteDog = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        };
        let data = await fetch(baseUrl + 'dogs', requestOptions);
        let json = await data.json();
        refetchDog();
    }

    {/*---------------  HTML  ---------------------------------------------------------------------------- */ }

    return (
        <div>
            <div class="grid grid-cols-3 gap-4">
                <div class="mt-20 col-span-1">
                    <input onInput={(e) => setFilterString(e.target.value)} type="text" id="filter"
                        class=" text-sm rounded-lg block w-full p-2.5 bg-base-200 focus:outline-none focus:bg-white"
                        placeholder="Gib Hundedaten zum Filtern ein" required>
                    </input>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1">
                    <div class="my-5">
                        {owner.loading ? "Daten werden geladen" : ""}
                        {owner.loading ? <span class="loading loading-spinner loading-md"></span> : ""}
                    </div>

                    {/* Tabelle mit allen Kunden */}
                    <div class="overflow-auto " style="max-height: 50vh;">
                        <table class="table table-pin-rows span-col-1">
                            <thead>
                                <tr class="font-bold text-base">
                                    <th>Name / Rasse</th>
                                    <th>Bild</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dogs() && dogs().filter((dog) => dog.name.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    dog.race.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    dog.age.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    dog.chip.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    dog.start.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    dog.end.toLowerCase().indexOf(filterString().toLowerCase()) >= 0
                                ).map((dog) =>
                                    <tr class={`cursor-pointer hover ${selectedRow() === dog.id ? "bg-base-200" : ""}`}
                                        onClick={() => { setSelectedRow(dog.id); setName(dog.name), setAge(dog.age), setRace(dog.race), setCastration(dog.castration), setChip(dog.chip), setEnd(dog.end), setStart(dog.start), setGender(dog.gender), setIdDog(dog.id), setDogIdImg(dog.idImg), setOwnerId(dog.ownerId) }}>
                                        <td>
                                            <div>
                                                <div class="font-bold">
                                                    {dog.name}
                                                </div>
                                                <div class="text-sm">{dog.race}</div>
                                            </div>
                                        </td>
                                        <td class=" py-4">
                                            <div class="avatar">
                                                <div class="w-16 rounded avatar">
                                                    <img src={dog.idImg === null ? 'NoImage.png' : imgDogUrl + dog.idImg} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="col-span-2 ml-5 " >
                    <div class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:px-0 xl:gap-4 ">
                        {/* Hunde-Informationen */}
                        <div class="col-span-2 p-4 mb-4 space-y-6 bg-base-100 ">
                            <div class=" px-4 mb-10">
                                <div class="px-4 py-2 bg-base-100 rounded">
                                    {idDog() ? (
                                        <p class="text-xl font-medium">{name()} </p>
                                    ) : (
                                        <p class="text-xl font-medium text-warning">Kein Hund ausgewählt</p>
                                    )}
                                </div>
                                <div class="  px-4 py-2 mb-5 ">
                                    <p><strong>Rasse:</strong> {race()}</p>
                                    <p><strong>Alter:</strong> {age()}</p>
                                    <p><strong>Geschlecht:</strong> {gender() === 1 ? 'weiblich' : 'männlich'}</p>
                                    <p><strong>Kastriert:</strong> {castration() === 1 ? 'ja' : 'nein'}</p>
                                    <p><strong>Chip-Nr.:</strong> {chip()}</p>
                                    <div>
                                        {start() ? (
                                            <p>
                                                <strong>Aufenthalt von </strong>
                                                {formatDate(start())}
                                                <strong> Bis </strong>
                                                {formatDate(end())}
                                            </p>
                                        ) : (
                                            <p>
                                                <strong>Aufenthalt von</strong> ---- <strong> Bis </strong>----
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="px-4">  {dogIdImg() !== "" ?
                                <a href={imgDogUrl + dogIdImg()} target="_blank"> <div class="avatar">
                                    <div class="w-16 rounded">
                                        <img src={dogIdImg() === null ? 'NoImage.png' : imgDogUrl + dogIdImg()} />
                                    </div></div></a>
                                : ""}
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class=" px-2">
                                    <button onClick={() => { idDog() != "" ? setChangeDogModalOpen(true) : setErrorMessage(true) }}
                                        class="cursor-pointer btn btn-secondary btn-sm">
                                        Hund ändern
                                    </button>
                                </div>
                                <button onClick={() => {
                                    if (idDog() !== "") {
                                        setDeleteMessageDog(true);

                                    } else {
                                        setErrorMessage(true);
                                    }
                                }} class="cursor-pointer btn btn-warning btn-sm ">
                                    Hund löschen
                                </button>
                            </div>
                        </div>

                        {/* Halter-Informationen */}
                        <div class="col-span-full xl:col-auto p-4 mb-4 space-y-6 bg-base-100">
                            {owner() && owner().filter((owner) => ownerId() === owner.id).map((owner) =>
                                <div>
                                    <div class="px-4 py-2 rounded">
                                        {ownerId() ? (
                                            <p class="text-xl font-medium">{owner.prename} {owner.surname}</p>
                                        ) : (
                                            <p class="text-xl font-medium text-warning">Kein Kunde vorhanden</p>
                                        )}
                                    </div>
                                    <div class="  px-4 py-2 mb-5">
                                        <p class="mb-5"> <strong>Kundennummer:</strong>  {owner.customerNo} </p>
                                        <p> <strong>Straße:</strong> {owner.street}</p>
                                        <p> <strong>PLZ: </strong>{owner.zipcode} </p>
                                        <p class="mb-5"> <strong >Wohnort:</strong> {owner.city}</p>
                                        <p> <strong>Telefonnummer:</strong> {owner.telephone}</p>
                                        <p> <strong>E-Mail:</strong> {owner.mail}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* -------------- POP-UPs -------------------------------------------------------------------- */}
            <div class={changeDogModalOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Hundedaten ändern</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="name" >
                                        Name
                                    </label>
                                    <input value={name()} onInput={(e) => setName(e.target.value)} id="name" class="appearance-none block w-full bg-gray-200   border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Name" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="race">
                                        Rasse
                                    </label>
                                    <input value={race()} onInput={(e) => setRace(e.target.value)} id="race" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white "  type="text" placeholder="Rasse" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="gender">
                                        Geschlecht
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">weiblich</span>
                                            <input type="radio" name="gender-radio" class="radio checked:bg-blue-500"
                                                checked={gender() === 1}
                                                onInput={(e) => setGender(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer"  >
                                            <span class="label-text">männlich</span>
                                            <input type="radio" name="gender-radio" class="radio checked:bg-blue-500"
                                                checked={gender() === 0}
                                                onInput={(e) => setGender(0)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="age">
                                        Alter
                                    </label>
                                    <input value={age()} onInput={(e) => setAge(e.target.value)} id = "age" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Alter" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="chip">
                                        Chip-Nummer
                                    </label>
                                    <input value={chip()} onInput={(e) => setChip(e.target.value)} id="chip" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Chipnummer" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="castration">
                                        Kastiert
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">ja</span>
                                            <input type="radio" name="castration-radio" class="radio checked:bg-blue-500"
                                                checked={castration() === 1}
                                                onClick={(e) => setCastration(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">nein</span>
                                            <input type="radio" name="castration-radio" class="radio checked:bg-blue-500"
                                                checked={castration() === 0} onClick={(e) => setCastration(0)} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="start">
                                        Aufenthaltsbeginn
                                    </label>
                                    <input type="date" id="start" name="stay-end" value={start()} onInput={(e) => setStart(e.target.value)} min="2023-01-01" max="2030-12-31" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></input>
                                </div>

                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="end">
                                        Aufenthaltsende
                                    </label>
                                    <input type="date" id="end" name="stay-end" value={end()} onInput={(e) => setEnd(e.target.value)} min="2023-01-01" max="2030-12-31" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></input>
                                </div>
                            </div>
                            <div class="flex flex-wrap ">
                                <div>  {dogIdImg() !== "" ?
                                    <div class="avatar mr-5">
                                        <div class="w-16 rounded">
                                            <img src={dogIdImg() === null ? 'NoImage.png' : imgDogUrl + dogIdImg()} />
                                        </div></div>
                                    : ""}
                                </div>
                                <input onInput={(e) => uploadDogImage(idDog(), e.target.files[0])} type="file" class="ml- 5 file-input file-input-bordered w-full max-w-xs mr-5" />
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3 mt-5">
                                <div class="px-2">
                                    <div class="cursor-pointer btn btn-secondary btn-sm" onClick={() => { setChangeDogModalOpen(false); putDog(); }}>Änderung Speichern</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setChangeDogModalOpen(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={errorMessage() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Achtung!</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <p>Bitte wähle erst einen Hund aus der Liste aus.</p>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 mt-5">
                                <button onClick={() => { setErrorMessage(false) }} class=" btn btn-secondary btn-sm ">Ok
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={deleteMessageDog() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-3xl py-0">Achtung!</h3>
                    <div class="py-4 px-">
                        <form class="w-full max-w-lg">
                            <p class="py-3">Sind sie sicher, dass sie diesen Hund löschen wollen?</p>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class="px-2">
                                    <div class=" px-2 cursor-pointer btn btn-secondary btn-sm" onClick={() => {
                                        deleteDog(idDog());
                                        setDeleteMessageDog(false)
                                    }}>Löschen</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setDeleteMessageDog(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
