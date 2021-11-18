import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-title">Nous retrouver</div>
      </div>
      <div>
        <div className="footer-title">Informations générales</div>
      </div>
      <div>
        <div className="footer-title">Nous contacter</div>
        <ul>
          <li>
            <a href="/contact">Par email</a>
          </li>
          <li>
            <a href="#">Par tchat</a>
          </li>
          <li>
            <a href="a-propos"></a>
          </li>
          <li>
            <a href="politique-de-confidentialite">
              Politique de confidentialité
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
