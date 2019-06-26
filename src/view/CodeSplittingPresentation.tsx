import React from "react";

export default function CodeSplittingPresentation() {
  return (
    <div>
      <main id="presentation">
        <h1>
          Getting <i>Lazy</i> with Code Splitting in React
        </h1>

        <hr />

        <section>
          <h2>Background</h2>
          <ul>
            <li>
              <b>Joe Hsu</b> asked if I wanted to give a talk at the frontend
              guild. <b>I said yes.</b>
            </li>
            <li>
              I happened to be working on a project that aimed to use to
              code-splitting at AppNexus, so I decided to give a shot at
              learning what I could.
            </li>
            <li>
              I used a side-project I had been working on to explore the code
              splitting tools available for React.
            </li>
            <li>
              Yes, I wrote my presentation in the app. <i>For science!</i>
            </li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>What is code splitting?</h2>
          <p>
            Code splitting is a technique in which code is separated into
            various bundles that can be loaded on demand or in parallel by a
            webapp.
          </p>
          <p>
            It can be accomplished in several ways, and fundamentally relies on
            the asynchronously loading of Javascript, CSS, and other assets.
          </p>
        </section>

        <hr />

        <section>
          <h2>Why use code splitting?</h2>
          <h3>What used to work</h3>
          <p>
            Previously, you could get by including a few vendor CDN scripts in
            your head tag, and wait for <code>$.(document).ready()</code> in
            your main.js file to be called. Sadly, but these days are gone.
          </p>
          <h3>The now now</h3>
          <p>
            As the expectation for feature-rich websites and applications has
            grown, Javascript codebase sizes have grown &{" "}
            <a href="https://speedcurve.com/blog/your-javascript-hurts/">
              demands on browser performance have increased
            </a>
            , which is especially bad for users on low-powered devices or with
            slow internet connections.
          </p>
          <p>
            Code splitting allows you to reduce demand on a users browser by
            downloading only what they currently need. This also enables the
            browser to cache assets in a more modular fashion, improving
            performance on subsequent page loads, but only fetching things that
            have changed.
          </p>
          <h3>Another tool in the chest</h3>
          <p>
            Being a good steward for users means being mindful of the
            performance of your web application. Code splitting is just another
            technique that enables you to do this, alongside other tried and
            true techniques.
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
              <b>Vendor splitting:</b> Splitting out vendor code that doesn't
              change often
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
            <b>React</b> introduced some new top-level API's in 16.6.0 to help
            with code splitting. These API's are <code>lazy</code> and{" "}
            <code>Suspense</code>, which are meant to be used in conjunction
            with dynamic imports <code>import()</code>
          </p>

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
          </ul>

          <p>
            <a href="https://webpack.js.org/guides/code-splitting/">
              <b>Webpack</b> also provides support for code splitting
            </a>
            , supporting vendor, entry point, and dynamic splitting. In
            conjunction, React gives you a high-level literate API, that Webpack
            can leverage to begin leveraging code splitting.
          </p>
          <p>
            <b>Create React App</b> is configured to provide this functionality
            by default. Let's take a look at how it works.
          </p>
        </section>

        <hr />

        <u>Resources:</u>
        <ul>
          <li>
            <a href="https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/">
              Google Web: Reduce Javascript Payloads with Code Splitting
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
