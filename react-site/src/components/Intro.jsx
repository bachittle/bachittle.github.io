import { FaGithub, FaLinkedin, FaFileAlt, FaProjectDiagram } from 'react-icons/fa';
import ParticleAnim from './ParticleAnim';
import Typewriter from './Typewriter';

export default function Intro({ onShowProjects }) {
  return (
    <div className="intro">
      <ParticleAnim />
      <div className="my-text">
        <h1 className="title"><Typewriter text="Bailey Chittle" eraseText={false} /></h1>
        <p className="description">
          <Typewriter
            texts={[
              'Software engineer',
              'Currently employed to write efficient C++ for ultrasonic systems',
              '"The more you know, the more you realize you know nothing" - Socrates',
              'I have experience in web development and project management',
              'while(isAlive) {eat();code();sleep();}',
              'My CSS is !important',
              '#Github.click()',
            ]}
          />
        </p>
      </div>
      <div className="logo-icons">
        <a className="icon" href="https://github.com/bachittle" target="_blank" rel="noopener noreferrer">
          <FaGithub size="2em" />
          <p>Github</p>
        </a>
        <a className="icon" href="https://linkedin.com/in/bailey-chittle" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size="2em" />
          <p>LinkedIn</p>
        </a>
        <a className="icon" href="/cv.pdf" target="_blank" rel="noopener noreferrer">
          <FaFileAlt size="2em" />
          <p>Resume</p>
        </a>
        <button className="icon" onClick={onShowProjects}>
          <FaProjectDiagram size="2em" />
          <p>Projects</p>
        </button>
      </div>
    </div>
  );
}
