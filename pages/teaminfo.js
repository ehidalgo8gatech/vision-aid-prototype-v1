import Navigation from "./navigation/Navigation";
import Image from 'next/image'
import austin from 'public/images/austin.webp';
import amber from 'public/images/amber.webp';
import chris from 'public/images/chris.webp';
import nasa from 'public/images/nasa.webp';
import Layout from './components/layout';

export default function TeamInfo() {
  return (
    <Layout>
      <Navigation />
      <div className="container">
        <div className="team-info">
          <h1>Project Description</h1>
            <p>
              The VA Partners team is dedicated to improving the partners application for the Vision
              Aid organization. This application is currently being used in production by the Vision
              Aid organization and its partners in hospitals around India.
            </p>
            <p>
              The application we will be improving is a web-based portal that helps coordinate all hospitals partnering with Vision Aid
              for providing diagnosis, counseling, training and optical devises for the visually impaired. It also provides aggregate
              customizable reports for each hospital and overall.
            </p>            
        </div>
        <div className="team-info">
          <h1>Meet Our Team</h1>
            <Image src={amber} alt="Amber" />
            <p>Amber Molina: Team Lead</p>
            <Image src={austin} alt="Austin" />
            <p>Austin Bieber: Tech Lead</p>
            <Image src={chris} alt="Chris" />
            <p>Christin Lin: Fullstack Developer</p>
            <Image src={nasa} alt="Nasa" />
            <p>Nasa Quba: Fullstack Developer</p>
        </div>
        <div className="team-info">
          <h1>Project Goals:</h1>
          <ol>
            <li>Rewrite authentication system to be more seamless</li>
            <li>Integrate authorization into the authentication system</li>
            <li>Design a customizable landing page that doesn&apos;t require dev assistance</li>
            <li>Upgrade the UI to meet accessibility standards</li>
            <li>Implement a feedback form for users to report issues and bugs</li>
            <li>Add a footer to all pages</li>
            <li>Implement any new changes specified by stakeholders</li>
          </ol>
        </div>
        <div className="team-info">
          <h1>Lighthouse Scores:</h1>
          <ol>
            <li>Performance: 100</li>
            <li>Accessibility: 100</li>
            <li>Best Practices: 100</li>
            <li>SEO: 100</li>
            <li>PWA: All aspects validated</li>
          </ol>
        </div>
        <div className="team-info">
          <h1>Important Links</h1>
          <ol>
            <p>
              <a href="https://vimeo.com/913052661?share=copy">Presentation Video</a>
            </p>
            <p>
              <a href="https://github.com/ajbieber/vision-aid-partners">Project GitHub</a>
            </p>            
          </ol>
        </div>
      </div>
    </Layout>
  );
};
