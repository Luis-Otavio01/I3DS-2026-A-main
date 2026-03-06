import { useEffect, useState } from "react";
import "./App.css";

import logo from "./assets/POTATOFLIX.png";
import lupa from "./assets/lupa.png";
import "bootstrap-icons/font/bootstrap-icons.css";

import Rodape from "./components/Rodape/Rodape";
import MovieCard from "./components/MovieCard/MovieCard";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const [openLang, setOpenLang] = useState(false);
  const [language, setLanguage] = useState("pt");
  const [theme, setTheme] = useState("light");

  // Aplicar tema ao body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // TRADUÇÕES
  const translations = {
    en: {
      search: "Search movies",
      notFound: "😢 Movie not found 😢",
    },
    pt: {
      search: "Pesquise por filmes",
      notFound: "😢 Filme não encontrado 😢",
    },
    es: {
      search: "Buscar películas",
      notFound: "😢 Película no encontrada 😢",
    },
    fr: {
      search: "Rechercher des films",
      notFound: "😢 Film non trouvé 😢",
    },
    de: {
      search: "Filme suchen",
      notFound: "😢 Film nicht gefunden 😢",
    },
    it: {
      search: "Cerca film",
      notFound: "😢 Film non trovato 😢",
    },
    ja: {
      search: "映画を検索",
      notFound: "😢 映画が見つかりません 😢",
    },
    ko: {
      search: "영화 검색",
      notFound: "😢 영화를 찾을 수 없습니다 😢",
    },
    zh: {
      search: "搜索电影",
      notFound: "😢 未找到电影 😢",
    },
  };

  // API
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  const apiUrl = `https://omdbapi.com/?apikey=${apiKey}`;

  // Buscar filmes
  const searchMovies = async (title) => {
    const response = await fetch(`${apiUrl}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  };

  // Filme inicial
  useEffect(() => {
    searchMovies("Jujutsu Kaisen");
  }, []);

  return (
    <div id="App">
      {/* BOTÃO DE TEMA */}
      <div className="themeToggle">
        <button className="themeButton" onClick={toggleTheme}>
          <i
            className={`bi bi-${theme === "light" ? "moon-stars-fill" : "sun-fill"}`}
          ></i>
        </button>
      </div>

      {/* MENU DE IDIOMA */}
      <div className="languageMenu">
        <button
          className={`langButton ${openLang ? "open" : ""}`}
          onClick={() => setOpenLang(!openLang)}
        >
          <i className="bi bi-list"></i>
        </button>

        {openLang && (
          <div className="dropdownLang">
            <p onClick={() => setLanguage("en")}>English</p>
            <p onClick={() => setLanguage("pt")}>Português</p>
            <p onClick={() => setLanguage("es")}>Español</p>
            <p onClick={() => setLanguage("fr")}>Français</p>
            <p onClick={() => setLanguage("de")}>Deutsch</p>
            <p onClick={() => setLanguage("it")}>Italiano</p>
            <p onClick={() => setLanguage("ja")}>日本語</p>
            <p onClick={() => setLanguage("ko")}>한국어</p>
            <p onClick={() => setLanguage("zh")}>中文</p>
          </div>
        )}
      </div>

      <img id="Logo" src={logo} alt="Logotipo do POTATOFLIX" />

      {/* BUSCA */}
      <div className="search">
        <input
          onKeyDown={(e) => e.key === "Enter" && searchMovies(search)}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={translations[language].search}
        />

        <img
          onClick={() => searchMovies(search)}
          src={lupa}
          alt="Botão de pesquisa"
        />
      </div>

      {/* LISTA DE FILMES */}
      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              {...movie}
              apiUrl={apiUrl}
              language={language}
            />
          ))}
        </div>
      ) : (
        <h2 className="empty">{translations[language].notFound}</h2>
      )}

      <Rodape link={"https://github.com/Luis-Otavio01"}>Batata</Rodape>
    </div>
  );
};

export default App;
