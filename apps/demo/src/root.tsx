// @refresh reload
import {Suspense} from 'solid-js';
import {Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title} from 'solid-start';
import './root.css';

export default function Root() {
  return (
      <Html lang="en">
        <Head>
          <Title>Demo for material.resrc.ch</Title>
          <Meta charset="utf-8"/>
          <Meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
        <Body>
          <Suspense>
            <ErrorBoundary>
              <div class={'root-container'}>
                <div class={'left-nav-bar'}>
                </div>
                <div class={'main-container'}>
                  <Routes>
                    <FileRoutes/>
                  </Routes>
                </div>
                <div class={'right-nav-bar'}></div>
              </div>
            </ErrorBoundary>
          </Suspense>
          <Scripts/>
        </Body>
      </Html>
  );
}
