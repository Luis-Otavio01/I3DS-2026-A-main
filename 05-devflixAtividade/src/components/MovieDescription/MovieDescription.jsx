import { useEffect, useState } from "react";
import styles from "./MovieDescription.module.css";

const translateText = async (text, targetLang) => {
  if (!text) return "";
  if (targetLang === "en") return text;

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text,
      )}`,
    );

    const data = await response.json();

    if (data && data[0]) {
      return data[0].map((item) => item[0]).join("");
    }

    return text;
  } catch (error) {
    console.error("Erro na tradução:", error);
    return text;
  }
};

const translations = {
  en: {
    watch: "Watch",
    rating: "Rating",
    duration: "Duration",
    cast: "Cast",
    genre: "Genre",
    synopsis: "Synopsis",
    movie: "Movie",
    series: "Series",
  },
  pt: {
    watch: "Assistir",
    rating: "Avaliação",
    duration: "Duração",
    cast: "Elenco",
    genre: "Gênero",
    synopsis: "Sinopse",
    movie: "Filme",
    series: "Série",
  },
  es: {
    watch: "Ver",
    rating: "Calificación",
    duration: "Duración",
    cast: "Elenco",
    genre: "Género",
    synopsis: "Sinopsis",
    movie: "Película",
    series: "Serie",
  },
  fr: {
    watch: "Regarder",
    rating: "Évaluation",
    duration: "Durée",
    cast: "Distribution",
    genre: "Genre",
    synopsis: "Synopsis",
    movie: "Film",
    series: "Série",
  },
  de: {
    watch: "Ansehen",
    rating: "Bewertung",
    duration: "Dauer",
    cast: "Besetzung",
    genre: "Genre",
    synopsis: "Synopsis",
    movie: "Film",
    series: "Serie",
  },
  it: {
    watch: "Guarda",
    rating: "Valutazione",
    duration: "Durata",
    cast: "Cast",
    genre: "Genere",
    synopsis: "Sinossi",
    movie: "Film",
    series: "Serie",
  },
  ja: {
    watch: "視聴する",
    rating: "評価",
    duration: "再生時間",
    cast: "キャスト",
    genre: "ジャンル",
    synopsis: "あらすじ",
    movie: "映画",
    series: "シリーズ",
  },
  ko: {
    watch: "시청하기",
    rating: "평점",
    duration: "재생 시간",
    cast: "출연진",
    genre: "장르",
    synopsis: "시놉시스",
    movie: "영화",
    series: "시리즈",
  },
  zh: {
    watch: "观看",
    rating: "评分",
    duration: "时长",
    cast: "演员",
    genre: "类型",
    synopsis: "简介",
    movie: "电影",
    series: "系列",
  },
};

const MovieDescription = ({ apiUrl, movieID, language, click }) => {
  const [movieDesc, setMovieDesc] = useState(null);
  const [translatedPlot, setTranslatedPlot] = useState("");
  const [translatedGenre, setTranslatedGenre] = useState("");

  // buscar dados do filme
  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(`${apiUrl}&i=${movieID}`);
      const data = await response.json();
      setMovieDesc(data);
    };

    fetchMovie();
  }, [apiUrl, movieID]);

  // traduzir sinopse
  useEffect(() => {
    setTranslatedPlot(""); // Resetar antes de traduzir
    const translatePlot = async () => {
      if (movieDesc?.Plot) {
        const translated = await translateText(movieDesc.Plot, language);
        setTranslatedPlot(translated);
      }
    };

    translatePlot();
  }, [movieDesc, language]);

  // traduzir gênero
  useEffect(() => {
    setTranslatedGenre(""); // Resetar antes de traduzir
    const translateGenre = async () => {
      if (movieDesc?.Genre) {
        const translated = await translateText(movieDesc.Genre, language);
        setTranslatedGenre(translated);
      }
    };

    translateGenre();
  }, [movieDesc, language]);

  if (!movieDesc) return null;

  const t = translations[language] || translations.en;
  const typeTranslated = movieDesc.Type === "movie" ? t.movie : t.series;

  return (
    <div className={styles.modalBackdrop} onClick={click}>
      <div className={styles.movieModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.movieInfo}>
          <img src={movieDesc.Poster} alt={movieDesc.Title} />

          <button className={styles.btnClose} onClick={click}>
            X
          </button>

          <div className={styles.movieType}>
            <div>
              <img src="/logo.png" alt="" />
              {typeTranslated}

              <h1>{movieDesc.Title}</h1>

              <a
                href={`https://google.com/search?q=${encodeURIComponent(
                  movieDesc.Title,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                ▶️ {t.watch}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.containerMisc}>
          <div className={styles.containerFlex}>
            {t.rating}: {movieDesc.imdbRating} | {t.duration}:{" "}
            {movieDesc.Runtime} | {movieDesc.Released}
          </div>

          <div className={styles.containerFlex}>
            <p>
              {t.cast}: {movieDesc.Actors}
            </p>
            <p>
              {t.genre}: {translatedGenre || movieDesc.Genre}
            </p>
          </div>
        </div>

        <div className={styles.desc}>
          <p>
            {t.synopsis}: {translatedPlot || movieDesc.Plot}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDescription;
