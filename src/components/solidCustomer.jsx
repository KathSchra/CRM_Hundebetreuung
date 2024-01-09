import { createSignal, createResource, For } from "solid-js";
import dayjs from 'dayjs';

export default function HundebetreuungServer(props) {
    let baseUrl = 'http://localhost:3000/api/'
    let imgDogUrl = 'http://localhost:3000/img/dog/'

    //Signals für Owner
    const [idOwner, setIdOwner] = createSignal("");
    const [prename, setPrename] = createSignal("");
    const [surname, setSurname] = createSignal("");
    const [telephone, setTelephone] = createSignal("");
    const [mail, setMail] = createSignal("");
    const [zipcode, setZipcode] = createSignal("");
    const [street, setStreet] = createSignal("");
    const [city, setCity] = createSignal("");
    const [customerNo, setCustomerNo] = createSignal("");

    const [ownerPosted, setOwnerPosted] = createSignal(false);
    const [ownerPostedId, setOwnerPostedId] = createSignal("");
    const [selectedRow, setSelectedRow] = createSignal(null);
    const [filterString, setFilterString] = createSignal("");

    const [changeOwnerModalOpen, setChangeOwnerModalOpen] = createSignal(false);
    const [newOwnerModalOpen, setNewOwnerModalOpen] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal(false);
    const [deleteMessageOwner, setDeleteMessageOwner] = createSignal(false);

    const fetchOwnerRessource = async () => {
        let data = await fetch(baseUrl + 'owner');
        let json = await data.json();
        console.log("owner data fetched", json);
        if (ownerPosted()) {
            console.log("posted")
            console.log(json);
            let newOwner = json.ownerObject.owner.find(owner => owner.id === ownerPostedId()); //Gibt neu erstellten Kunden an Frontend zurück
            console.log("new owner", newOwner)
            setOwnerId(newOwner.id); //Fremdschlüssel in Dog muss gesetzt sein, um Button "Neuen Hund anlegen" zu aktivieren
            setCustomerNo(newOwner.customerNo)
            setIdOwner(newOwner.id)
            setOwnerPosted(false);
        }
        return json.ownerObject.owner;
    }

    const [owner, { refetch: refetchOwner }] = createResource(fetchOwnerRessource);

    //Signals für Dog
    const [idDog, setIdDog] = createSignal("");
    const [name, setName] = createSignal("");
    const [race, setRace] = createSignal("");
    const [age, setAge] = createSignal("");
    const [gender, setGender] = createSignal(1);
    const [castration, setCastration] = createSignal(1);
    const [chip, setChip] = createSignal("");
    const [start, setStart] = createSignal("");
    const [end, setEnd] = createSignal("");
    const [ownerId, setOwnerId] = createSignal("");
    const [dogIdImg, setDogIdImg] = createSignal("")
    
    function formatDate(dateString) {
        const date = dayjs(dateString);
        return date.format('DD.MM.YYYY');
    }

    const [changeDogModalOpen, setChangeDogModalOpen] = createSignal(false);
    const [newDogModalOpen, setNewDogModalOpen] = createSignal(false);
    const [deleteMessageDog, setDeleteMessageDog] = createSignal(false);

    const fetchDogsRessource = async () => {
        let data = await fetch(baseUrl + 'dogs');
        let json = await data.json();
        console.log("dog data fetched", json);
        return json.dogObject.dogs;
    }
    const [dogs, { refetch: refetchDog }] = createResource(fetchDogsRessource);

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

    {/*---------------  POST, PUT,  DEL für Owner ---------------------------------------------------------------------------- */ }

    const postOwner = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prename: prename(), surname: surname(), telephone: telephone(), mail: mail(), street: street(), zipcode: zipcode(), city: city() })
        };
        let data = await fetch(baseUrl + 'owner', requestOptions);
        let json = await data.json();
        setOwnerPosted(true);
        setOwnerPostedId(json.id);
        console.log(json);
        refetchOwner();
    }

    const putOwner = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idOwner(), prename: prename(), surname: surname(), telephone: telephone(), mail: mail(), street: street(), zipcode: zipcode(), city: city(), customerNo: customerNo() })
        };
        let data = await fetch(baseUrl + 'owner', requestOptions);
        let json = await data.json();
        console.log(json);
        refetchOwner();
    }

    const deleteOwner = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        };
        let data = await fetch(baseUrl + 'owner', requestOptions);
        let json = await data.json();
        refetchOwner();
    }

    {/*---------------  POST, PUT,  DEL für Dog ---------------------------------------------------------------------------- */ }

    const postDog = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name(), race: race(), age: age(), gender: gender(), castration: castration(), chip: chip(), start: start(), end: end(), ownerId: ownerId() })
        };
        let data = await fetch(baseUrl + 'dogs', requestOptions);
        let json = await data.json();

        console.log(json);
        refetchDog();
    }

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

    {/*---------------  HTML ---------------------------------------------------------------------------- */ }

    return (
        <div>
            <div class="grid grid-cols-3 gap-4 ">
                <div class="col-span-1 mt-20">
                    <button onClick={() => { setIdOwner(""); setPrename(""); setSurname(""); setTelephone(""); setMail(""); setStreet(""); setZipcode(""); setCity(""); setNewOwnerModalOpen(true); }}
                        class="cursor-pointer btn btn-primary btn-sm ">
                        Neuen Kunden anlegen
                    </button>
                    <div class="mt-5">
                        <input onInput={(e) => setFilterString(e.target.value)} type="text" id="filter"
                            class="text-sm rounded-lg block w-full p-2.5 bg-base-200 focus:outline-none focus:bg-white "
                            placeholder="Gib Kundendaten zum Filtern ein" required>
                        </input>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1">
                    <div class="my-5">
                        {owner.loading ? "Daten werden geladen" : ""}
                        {owner.loading ? <span class="loading loading-spinner loading-md"></span> : ""}
                    </div>

                    {/* Tabelle mit allen Kunden */}
                    <div class="container overflow-auto " style="max-height: calc(80vh - 3.5rem)">
                        <table class="table table-pin-rows mt-5">
                            <thead>
                                <tr class="font-bold text-base">
                                    <th>Name / Kundennr</th>
                                    <th>Hunde</th>
                                </tr>
                            </thead>
                            <tbody class=" " style="max-height: 20vh;">
                                {owner() && owner().filter((owner) =>
                                    owner.prename.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    owner.surname.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    owner.telephone.toString().indexOf(filterString()) >= 0 ||
                                    owner.zipcode.toString().indexOf(filterString()) >= 0 ||
                                    owner.street.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    owner.mail.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 ||
                                    owner.customerNo.toString().indexOf(filterString()) >= 0 ||
                                    owner.city.toLowerCase().indexOf(filterString().toLowerCase()) >= 0
                                ).map((owner) => (
                                    <tr
                                        class={`cursor-pointer hover ${selectedRow() === owner.id ? "bg-base-200" : ""}`}
                                        onClick={() => { setSelectedRow(owner.id); setOwnerId(owner.id); setIdOwner(owner.id); setCustomerNo(owner.customerNo); setPrename(owner.prename); setSurname(owner.surname); setTelephone(owner.telephone); setMail(owner.mail); setZipcode(owner.zipcode); setStreet(owner.street); setCity(owner.city) }}
                                    >
                                        <td>
                                            <div>
                                                <div class="font-bold">
                                                    {owner.surname}, {owner.prename}
                                                </div>
                                                <div class="text-sm">{owner.customerNo}</div>
                                            </div>
                                        </td>

                                        <td>
                                            {dogs() &&
                                                dogs()
                                                    .filter((dog) => dog.ownerId === owner.id)
                                                    .map((dog) => (
                                                        <p>{dog.name}</p>
                                                    ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="col-span-2 ml-5 ">
                    {/* Halter-Informationen */}
                    <div class="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:px-0 xl:gap-4" style="max-height: calc(80vh - 3.5rem)">
                        <div class="col-span-full xl:col-auto">
                            <div class="p-4 mb-4 space-y-6 ">
                                <div class="px-4 py-2  rounded">
                                    {idOwner() ? (
                                        <p class="text-xl font-medium ">{prename()} {surname()}</p>
                                    ) : (
                                        <p class="text-xl font-medium text-warning">Kein Kunde ausgewählt</p>
                                    )}
                                </div>
                                <div class="  px-4 py-2 mb-5 ">
                                    <p class="mb-5"> <strong>Kundennummer: </strong>{customerNo()} </p>
                                    <p> <strong>Straße: </strong>{street()}</p>
                                    <p> <strong>PLZ: </strong>{zipcode()} </p>
                                    <p class="mb-5"> <strong >Wohnort: </strong>{city()}</p>
                                    <p> <strong>Telefonnummer: </strong>{telephone()}</p>
                                    <p> <strong>E-Mail: </strong>{mail()}</p>
                                </div>
                                <div class="px-4 py-2">
                                    <div class=" py-2">
                                        <button onClick={() => { ownerId() != "" ? setChangeOwnerModalOpen(true) : setErrorMessage(true) }}
                                            class="cursor-pointer  btn btn-secondary btn-sm ">
                                            Kunde ändern
                                        </button>
                                    </div>
                                    <div class=" py-2">
                                        <button onClick={() => {
                                            if (idOwner() !== "") {
                                                setDeleteMessageOwner(true);

                                            } else {
                                                setErrorMessage(true);
                                            }
                                        }} class="cursor-pointer btn btn-warning btn-sm ">
                                            Kunde löschen
                                        </button>
                                    </div>
                                    <div class=" py-2">
                                        <button onClick={() => { setIdDog(""); setName(""); setRace(""); setGender(1); setAge(""); setCastration(1); setChip(""); setStart(""); setEnd(""); { ownerId() != "" ? setNewDogModalOpen(true) : setErrorMessage(true) } }}
                
                                            class=" cursor-pointer btn btn-primary btn-sm ">
                                            Neuen Hund anlegen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hunde-Informationen */}
                        <div class="col-span-2 p-4 mb-4 space-y-6 bg-transparent  overflow-auto" style="max-height: calc(80vh - 3.5rem)">
                            {dogs() && dogs().filter((dog) => dog.ownerId === ownerId()).map((dog) =>
                                <div class="collapse collapse-arrow bg-base-200 mb-5">
                                    <input type="checkbox" />
                                    <div class="collapse-title text-xl font-medium">
                                        <h3>{dog.name} </h3>
                                    </div>
                                    <div class="collapse-content" style="max-height: calc(80vh - 3.5rem)">
                                        <div class="p-4 mb-4 space-y-6 bg-base-200 rounded-lg shadow-sm " >
                                            <div class="h-32 px-4 py-2 mb-10">
                                                <p><strong>Rasse:</strong> {dog.race}</p>
                                                <p><strong>Alter:</strong> {dog.age}</p>
                                                <p><strong>Geschlecht:</strong> {dog.gender === 1 ? 'weiblich' : 'männlich'}</p>
                                                <p><strong>Kastriert:</strong> {dog.castration === 1 ? 'ja' : 'nein'}</p>
                                                <p><strong>Chip-Nr.:</strong> {dog.chip}</p>
                                                <div>
                                                    {dog.start ? (<p><strong>Aufenthalt von </strong>{formatDate(dog.start)} <strong> Bis </strong>{formatDate(dog.end)}</p>) : (<p><strong>Aufenthalt von</strong> ---- <strong> Bis </strong>----</p>)}
                                                </div>
                                            </div>
                                            <div class="px-4">  {dog.idImg !== "" ?
                                                <a href={imgDogUrl + dog.idImg} target="_blank"> <div class="avatar">
                                                    <div class="w-16 rounded">
                                                        <img src={dog.idImg === null ? 'NoImage.png' : imgDogUrl + dog.idImg} />
                                                    </div></div></a>
                                                : ""}
                                            </div>
                                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                                <div class=" px-2">
                                                    <button onClick={() => { setIdDog(dog.id); setName(dog.name); setRace(dog.race); setAge(dog.age); setGender(dog.gender); setCastration(dog.castration); setChip(dog.chip); setOwnerId(dog.ownerId); setStart(dog.start), setEnd(dog.end); setDogIdImg(dog.idImg), setChangeDogModalOpen(true); }}
                                                        class="cursor-pointer btn btn-secondary btn-sm">
                                                        Hund ändern
                                                    </button>
                                                </div>
                                                <button onClick={() => {setDeleteMessageDog(true)                                                  
                                                }} class="cursor-pointer btn btn-warning btn-sm">
                                                    Hund löschen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* -------------- POP-UPs FÜR HUNDE -------------------------------------------------------------------- */}
            <div class={newDogModalOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Neuen Hund anlegen</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="name">
                                        Name
                                    </label>
                                    <input value={name()} onInput={(e) => setName(e.target.value)} id="name" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Name" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide  text-xs font-bold mb-2" for="race" >
                                        Rasse
                                    </label>
                                    <input value={race()} onInput={(e) => setRace(e.target.value)} id = "race" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white 0" type="text" placeholder="Rasse" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide  text-xs font-bold mb-2" for="gender_female"  >
                                        Geschlecht
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">weiblich</span>
                                            <input type="radio" name="gender-radio" id="gender_female" class="radio checked:bg-blue-500" checked
                                                onInput={(e) => setGender(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">männlich</span>
                                            <input type="radio" id="gender_male" name="gender-radio" class="radio checked:bg-blue-500"
                                                onInput={(e) => setGender(0)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="age"  >
                                        Alter
                                    </label>
                                    <input value={age()} onInput={(e) => setAge(e.target.value)} id="age" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Alter" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-widetext-xs font-bold mb-2" for="chip"    >
                                        Chip-Nummer
                                    </label>
                                    <input value={chip()} onInput={(e) => setChip(e.target.value)} id="chip" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"type="text" placeholder="Chip-Nummer" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="castration" >
                                        Kastiert
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer" >
                                            <span class="label-text">ja</span>
                                            <input type="radio" name="castration-radio" id="castration_yes" class="radio checked:bg-blue-500" checked
                                                onInput={(e) => setCastration(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">nein</span>
                                            <input type="radio" name="castration-radio" id="castration_no" class="radio checked:bg-blue-500"
                                                onInput={(e) => setCastration(0)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide  text-xs font-bold mb-2"  for="start"  >
                                        Aufenthaltsbeginn
                                    </label>
                                    <input type="date" id="start" name="stay-end" value={start()} onInput={(e) => setStart(e.target.value)} min="2023-01-01" max="2030-12-31" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></input>
                                </div>

                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="end" >
                                        Aufenthaltsende
                                    </label>
                                    <input type="date" id="end" name="stay-end" value={end()} onInput={(e) => setEnd(e.target.value)} min="2023-01-01" max="2030-12-31" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></input>
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class="cursor-pointer bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-full" onClick={() => { setNewDogModalOpen(false); postDog(); }}>Speichern</div>
                                <div class="cursor-pointer bg-transparent text-red-500 border border-red-700 hover:bg-red-700 hover:text-white font-bold mx-6 py-2 px-4 rounded-full" onClick={() => setNewDogModalOpen(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={changeDogModalOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Hundedaten ändern</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide  text-xs font-bold mb-2"  for="name"  >
                                        Name
                                    </label>
                                    <input value={name()} onInput={(e) => setName(e.target.value)} id="name" class="appearance-none block w-full bg-gray-200   border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Name" />
                                    {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="race" >
                                        Rasse
                                    </label>
                                    <input value={race()} onInput={(e) => setRace(e.target.value)} id="race" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white " type="text" placeholder="Rasse" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="gender" >
                                        Geschlecht
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">weiblich</span>
                                            <input type="radio" id="gender_female" name="gender-radio" class="radio checked:bg-blue-500"
                                                checked={gender() === 1}
                                                onInput={(e) => setGender(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">männlich</span>
                                            <input type="radio" id="gender_male" name="gender-radio" class="radio checked:bg-blue-500"
                                                checked={gender() === 0}
                                                onInput={(e) => setGender(0)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2"  for="age" >
                                        Alter
                                    </label>
                                    <input value={age()} onInput={(e) => setAge(e.target.value)} id="age" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Alter" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="chip"   >
                                        Chip-Nummer
                                    </label>
                                    <input value={chip()} onInput={(e) => setChip(e.target.value)} id="chip" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Chipnummer" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="castration"  >
                                        Kastiert
                                    </label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">ja</span>
                                            <input type="radio" name="castration-radio" id="castration_yes" class="radio checked:bg-blue-500"
                                                checked={castration() === 1}
                                                onClick={(e) => setCastration(1)} />
                                        </label>
                                    </div>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <span class="label-text">nein</span>
                                            <input type="radio" name="castration-radio" id="castration_no" class="radio checked:bg-blue-500"
                                                checked={castration() === 0}
                                                onClick={(e) => setCastration(0)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="start"   >
                                        Aufenthaltsbeginn
                                    </label>
                                    <input type="date" id="start" name="stay-end" value={start()} onInput={(e) => setStart(e.target.value)} min="2023-01-01" max="2030-12-31" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></input>
                                </div>

                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="end"  >
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

            {/* -------------- POP-UPs FÜR HALTER -------------------------------------------------------------------- */}

            <div class={newOwnerModalOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Neuen Kunden anlegen</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2"  for="prename"  >
                                        Vorname
                                    </label>
                                    <input value={prename()} onInput={(e) => setPrename(e.target.value)} id="prename" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Vorname" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="surname"  >
                                        Nachname
                                    </label>
                                    <input value={surname()} onInput={(e) => setSurname(e.target.value)} id="surname" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Nachname" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for ="telephone"  >
                                        Telefonnummer
                                    </label>
                                    <input value={telephone()} onInput={(e) => setTelephone(e.target.value)} id="telephone" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white " type="text" placeholder="Telefonnummer" />
                                </div>
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="mail"  >
                                        E-Mail
                                    </label>
                                    <input value={mail()} onInput={(e) => setMail(e.target.value)} id="mail" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="E-Mail" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="street"   >
                                        Straße
                                    </label>
                                    <input value={street()} onInput={(e) => setStreet(e.target.value)} id="street" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Straße" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="zipCode"  >
                                        PLZ
                                    </label>
                                    <input value={zipcode()} onInput={(e) => setZipcode(e.target.value)} id="zipCode" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="PLZ" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="city"   >
                                        Ort
                                    </label>
                                    <input value={city()} onInput={(e) => setCity(e.target.value)} id="city" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Ort" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class="px-2">
                                    <div class=" px-2 cursor-pointer btn btn-secondary btn-sm" onClick={() => { setNewOwnerModalOpen(false); postOwner(); }}>Speichern</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setNewOwnerModalOpen(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={changeOwnerModalOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Kundendaten ändern</h3>
                    <div class="py-10">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="prename"   >
                                        Vorname
                                    </label>
                                    <input value={prename()} onInput={(e) => setPrename(e.target.value)} id="prename" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Vorname" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="surname" >
                                        Nachname
                                    </label>
                                    <input value={surname()} onInput={(e) => setSurname(e.target.value)} id="surname" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Nachname" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="telephone">
                                        Telefonnummer
                                    </label>
                                    <input value={telephone()} onInput={(e) => setTelephone(e.target.value)} id="telephone" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Telefonnummer" />
                                </div>
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="mail">
                                        E-Mail
                                    </label>
                                    <input value={mail()} onInput={(e) => setMail(e.target.value)} id="mail" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="E-Mail" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="street">
                                        Straße
                                    </label>
                                    <input value={street()} onInput={(e) => setStreet(e.target.value)} id="street" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Straße" />
                                </div>
                                <div class="w-full md:w-1/2 px-3">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="zipCode">
                                        PLZ
                                    </label>
                                    <input value={zipcode()} onInput={(e) => setZipcode(e.target.value)} id="zipCode" class="appearance-none block w-full bg-gray-200   border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="PLZ" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide   text-xs font-bold mb-2" for="city">
                                        Ort
                                    </label>
                                    <input value={city()} onInput={(e) => setCity(e.target.value)} id="city" class="appearance-none block w-full bg-gray-200   border border-grey-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"  type="text" placeholder="Ort" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class="px-2">
                                    <div class="cursor-pointer btn btn-secondary btn-sm" onClick={() => { setChangeOwnerModalOpen(false); putOwner(); }}>Änderung Speichern</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setChangeOwnerModalOpen(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={errorMessage() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-3xl py-0">Achtung!</h3>
                    <div class="py-4 px-">
                        <form class="w-full max-w-lg">
                            <p class="py-3">Bitte wähle erst einen Kunden aus der Liste aus.</p>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 mt-5">
                                <button onClick={() => { setErrorMessage(false) }} class=" btn btn-secondary btn-sm ">Ok
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class={deleteMessageOwner() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                    <h3 class="font-bold text-3xl py-0">Achtung!</h3>
                    <div class="py-4 px-">
                        <form class="w-full max-w-lg">
                            <p class="py-3">Sind sie sicher, dass sie diesen Kunden und alle zugehörigen Hunde löschen wollen?</p>
                            <div class="flex flex-wrap -mx-3 mb-2 px-3 py-3">
                                <div class="px-2">
                                    <div class=" px-2 cursor-pointer btn btn-secondary btn-sm" onClick={() => {
                                        deleteOwner(idOwner());
                                        deleteDog(idOwner());
                                        location.reload();
                                        setDeleteMessageOwner(false)
                                    }}>Löschen</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setDeleteMessageOwner(false)}>Abbrechen</div>
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
                                        deleteDog(idOwner());
                                        setDeleteMessageDog(false)
                                    }}>Löschen</div>
                                </div>
                                <div class="cursor-pointer btn btn-warning btn-sm" onClick={() => setDeleteMessageDog(false)}>Abbrechen</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
