import React from "react";

export default function CodeSplittingPresentation() {
  return (
    <div>
      <main id="homepage">
        <h1>Code Splitting / Lazy Loading</h1>

        <hr />

        <section>
          <h2>Background</h2>
          <p>Hello</p>
        </section>

        <hr />

        <section>
          <h2>What is code splitting?</h2>
          <p>
            Code splitting is a technique for separating code into various
            bundles that can be loaded on demand or in parallel by a webapp.
          </p>
          <p>
            It can be accomplished in several ways, and fundamentally relies on
            the asynchronously loading assets.
          </p>
        </section>

        <hr />

        <section>
          <h2>Why use code splitting?</h2>
          <h3>What used to work</h3>
          <p>
            Previously, you could get by including a few vendor CDN scripts in
            your head tag, and wait for $.(document).ready() in your main.js
            file to be called. Sadly, but these days are gone.
          </p>
          <h3>The now now</h3>
          <p>
            As the expectation for feature-rich websites and applications has
            grown, javascript codebase sizes have grown & demands on browser
            performance have increased.
          </p>
          <p>
            Code splitting allows you to reduce demand on a users browser by
            downloading they currently need. Splitting also enables the browser
            to cache assets, improving performance on subsequent page loads.
          </p>
        </section>

        <hr />

        <section>
          <h2>How does code splitting work?</h2>
          <p>
            Code splitting takes a few different forms. Common approaches
            include some or all of the following:
          </p>
          <ul>
            <li>
              <b>Vendor splitting:</b> Splitting out vendor code
            </li>
            <li>
              <b>Entry point splitting:</b> Splitting on a page or app level
              within a SPA or server-paged setup.
            </li>
            <li>
              <b>Dynamic splitting:</b> Splitting via dynamic imports
            </li>
          </ul>
        </section>

        <hr />

        <section>
          <h1>Code Splitting with React</h1>

          <p>
            React introduced some new top-level API's in 16.6.0 to help with
            code splitting. For the{" "}
          </p>
        </section>

        <hr />

        <u>Resources:</u>
        <ul>
          <li>
            <a href="https://reactjs.org/docs/code-splitting.html#reactlazy">
              React Code Splitting Docs
            </a>
          </li>
          <li>
            <a href="https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html">
              Dan Abramov's Suspense presentation
            </a>
          </li>
          <li>
            <a href="https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/">
              Google Web: Reduce Javascript Payloads with Code Splitting
            </a>
          </li>
        </ul>

        <u>Examples:</u>
        <ul>
          <li>
            fetching data over http, instead of loading the whole database
          </li>
          <li>
            paginated websites, that dedicate a page to a specifc set of data or
            tasks
          </li>
          <li>
            streaming data, instead of downloading an entire file's content
          </li>
        </ul>
      </main>
    </div>
  );
}
