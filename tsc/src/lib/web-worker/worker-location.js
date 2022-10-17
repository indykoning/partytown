import "../types";
export function forwardLocationChange($winId$, env, data) {
    const history = env.$window$.history;
    switch (data.type) {
        case 0 /* PushState */: {
            env.$propagateHistoryChange$ = false;
            try {
                history.pushState(data.state, '', data.newUrl);
            }
            catch (e) { }
            env.$propagateHistoryChange$ = true;
            break;
        }
        case 1 /* ReplaceState */: {
            env.$propagateHistoryChange$ = false;
            try {
                history.replaceState(data.state, '', data.newUrl);
            }
            catch (e) { }
            env.$propagateHistoryChange$ = true;
            break;
        }
    }
}
