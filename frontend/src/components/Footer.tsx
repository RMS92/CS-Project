import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-title">Informations générales</div>
        <ul>
          <li>
            © 2022 CS Event – Site réalisé par des étudiants de CentraleSupélec
            sur le campus de Rennes dans le cadre d’un projet sur la détection
            d’injections SQL
          </li>
        </ul>
      </div>
      <div>
        <div className="footer-title">Nous contacter</div>
        <ul>
          <li>
            Vous pouvez nous contacter en cas de questions :
            <a href="mailto:csevent.contact@gmail.com">
              csevent.contact@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
