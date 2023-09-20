import { useEffect, useState } from "react";
import Auth from "./components/auth/Auth";
import { db, auth, storage } from "./config/firebase";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

interface IMovie {
    receivedAnOscar: boolean;
    releaseDate: number;
    title: string;
    userId: string;
    id: string;
}

function App() {
    const [movieList, setMovieList] = useState<IMovie[]>([]);
    const [newMovieTitle, setNewMovieTitle] = useState<string>("");
    const [newReleaseDate, setNewReleaseDate] = useState<number>(0);
    const [isNewMovieOscar, setIsNewMovieOscar] = useState<boolean>(false);
    const [fileUpload, setFileUpload] = useState<File>(null);
    const [updatedTitle, setUpdatedTitle] = useState<string>("");

    const moviesCollectionRef = collection(db, "movies");

    const getMovieList = async () => {
        try {
            const data = await getDocs(moviesCollectionRef);
            const filteredData = data.docs.map((doc) => ({
                ...(doc.data() as IMovie),
                id: doc.id,
            }));

            setMovieList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getMovieList();
    }, []);

    const onSubmitMovie = async () => {
        try {
            await addDoc(moviesCollectionRef, {
                title: newMovieTitle,
                releaseDate: newReleaseDate,
                receivedAnOscar: isNewMovieOscar,
                userId: auth.currentUser?.uid,
            });
            getMovieList();
            setIsNewMovieOscar(false);
            setNewMovieTitle("");
            setNewReleaseDate(0);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMovie = async (id: string) => {
        try {
            const movieDoc = doc(db, "movies", id);
            await deleteDoc(movieDoc);
            getMovieList();
        } catch (err) {
            console.error(err);
        }
    };

    const updateMovie = async (id: string) => {
        try {
            const movieDoc = doc(db, "movies", id);
            await updateDoc(movieDoc, { title: updatedTitle });
            getMovieList();
        } catch (err) {
            console.error(err);
        }
    };

    const uploadFile = async () => {
        if (!fileUpload) return;
        const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
        try {
            await uploadBytes(filesFolderRef, fileUpload);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Auth />
            <div>
                <input
                    type="text"
                    placeholder="Movie title..."
                    value={newMovieTitle}
                    onChange={(e) => setNewMovieTitle(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Release date..."
                    value={newReleaseDate}
                    onChange={(e) => setNewReleaseDate(Number(e.target.value))}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isNewMovieOscar}
                        onChange={(e) => setIsNewMovieOscar(e.target.checked)}
                    />
                    Received an Oscar
                </label>
                <button onClick={onSubmitMovie}>Submit movie</button>
            </div>
            <div>
                {movieList.map((movie) => {
                    return (
                        <div key={movie.id}>
                            <h1
                                style={{
                                    color: movie.receivedAnOscar
                                        ? "green"
                                        : "red",
                                }}>
                                {movie.title}
                            </h1>
                            <p>Date: {movie.releaseDate}</p>
                            <button onClick={() => deleteMovie(movie.id)}>
                                Delete
                            </button>

                            <input
                                type="text"
                                placeholder="New title..."
                                onChange={(e) =>
                                    setUpdatedTitle(e.target.value)
                                }
                            />
                            <button onClick={() => updateMovie(movie.id)}>
                                Update title
                            </button>
                        </div>
                    );
                })}
            </div>
            <div>
                <input
                    type="file"
                    onChange={(e) => {
                        e.target.files && setFileUpload(e.target.files[0]);
                    }}
                />
                <button onClick={uploadFile}>Upload file</button>
            </div>
        </div>
    );
}

export default App;
