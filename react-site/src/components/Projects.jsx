export default function Projects({ onBack }) {
  return (
    <div className="projects">
      <h2>Projects</h2>
      <div className="cards">
        <a href="https://github.com/bachittle/uwindsor-timetable-scraper" className="card" target="_blank" rel="noopener noreferrer">
          <h3>UTable</h3>
        </a>
        <a href="https://github.com/bachittle/visual-sorting-online" className="card" target="_blank" rel="noopener noreferrer">
          <h3>visual-sorting-online</h3>
        </a>
        <a href="https://github.com/bachittle/playlist-creator" className="card" target="_blank" rel="noopener noreferrer">
          <h3>playlist creator</h3>
        </a>
      </div>
      <div className="back-btn">
        <button onClick={onBack}>Go back to home page</button>
      </div>
    </div>
  );
}
