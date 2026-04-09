(function() {
    if (window.__prototype_loaded) return;
    window.__prototype_loaded = true;

    document.addEventListener("DOMContentLoaded", () => {
        // Build the Figma Prototype UI wrapper
        const bgWrap = document.createElement('div');
        bgWrap.id = 'figma-bg-wrap';
        bgWrap.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #1e1e1e; z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            overflow: hidden; flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        // Figma top toolbar
        const figmaToolbar = document.createElement('div');
        figmaToolbar.style.cssText = `
            width: 100%; height: 48px; background: #2c2c2c; border-bottom: 1px solid #000;
            display: flex; align-items: center; justify-content: space-between; padding: 0 16px; box-sizing: border-box;
            color: #fff; flex-shrink: 0;
        `;
        figmaToolbar.innerHTML = `
            <div style="display:flex; align-items:center; gap: 12px; font-size: 13px; font-weight: 500;">
                <div style="width: 28px; height: 28px; border-radius: 4px; background: #0ece7b; display:flex; align-items:center; justify-content:center; color:#111;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                MediSync Project / Prototype View
            </div>
            <div style="display:flex; align-items:center; gap: 16px; font-size: 13px; color: #aaa;">
                <span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; cursor:pointer;" onclick="location.href='/'">Flow: Homepage</span>
                <span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; cursor:pointer;" onclick="location.href='/login'">Flow: Login</span>
                <span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; cursor:pointer;" onclick="location.href='/dashboard'">Flow: Dashboard</span>
                <span>Fit to Screen</span>
                <span style="background: #0ea5e9; color: #fff; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight:bold;">Share prototype</span>
            </div>
        `;
        bgWrap.appendChild(figmaToolbar);

        // Macbook Device Frame Container
        const frameContainer = document.createElement('div');
        frameContainer.style.cssText = `
            width: 100%; max-width: 1400px; height: calc(100vh - 100px);
            background: transparent; border-radius: 12px;
            margin: auto; display: flex; flex-direction: column;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        `;

        const frameHeader = document.createElement('div');
        frameHeader.style.cssText = `
            height: 38px; background: #dcdcdc; border-top-left-radius: 12px; border-top-right-radius: 12px;
            display: flex; align-items: center; padding: 0 16px; gap: 8px; flex-shrink: 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        `;
        ['#ff5f56','#ffbd2e','#27c93f'].forEach(c => {
            const d = document.createElement('div');
            d.style.cssText = `width: 12px; height: 12px; border-radius: 50%; background: ${c};`;
            frameHeader.appendChild(d);
        });

        // The actual window where original content goes
        const frameContent = document.createElement('div');
        frameContent.style.cssText = `
            flex: 1; background: #ffffff;
            border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
            overflow-y: auto; overflow-x: hidden; position: relative;
        `;
        
        // Grab context styles to inherit
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        frameContent.style.backgroundColor = bodyBg;
        
        // Move body contents into frameContent
        const children = Array.from(document.body.childNodes);
        children.forEach(child => {
            if (child !== bgWrap) {
                frameContent.appendChild(child);
            }
        });

        frameContainer.appendChild(frameHeader);
        frameContainer.appendChild(frameContent);
        bgWrap.appendChild(frameContainer);
        
        document.body.appendChild(bgWrap);
        
        // Override body styles strictly
        document.body.style.setProperty('margin', '0', 'important');
        document.body.style.setProperty('overflow', 'hidden', 'important');
        document.body.style.setProperty('background', '#1e1e1e', 'important');

        // Add Figma "click hotspot" effect
        frameContent.addEventListener('click', (e) => {
            const isClickable = e.target.closest('a') || e.target.closest('button') || e.target.closest('input') || e.target.closest('.call-btn') || e.target.closest('[onclick]');
            if (!isClickable) {
                const links = frameContent.querySelectorAll('a, button, input[type="submit"], input[type="button"], .call-btn, [onclick]');
                links.forEach(l => {
                    const rect = l.getBoundingClientRect();
                    if(rect.width > 0 && rect.height > 0) {
                        const flash = document.createElement('div');
                        flash.style.cssText = `
                            position: absolute;
                            background: rgba(14, 165, 233, 0.2); border: 2px solid rgba(14, 165, 233, 0.8);
                            border-radius: 4px; pointer-events: none; z-index: 99999;
                            animation: figmaFlash 0.4s ease-out;
                        `;
                        const fcRect = frameContent.getBoundingClientRect();
                        flash.style.left = (rect.left - fcRect.left + frameContent.scrollLeft) + 'px';
                        flash.style.top = (rect.top - fcRect.top + frameContent.scrollTop) + 'px';
                        flash.style.width = rect.width + 'px';
                        flash.style.height = rect.height + 'px';
                        
                        frameContent.appendChild(flash);
                        setTimeout(() => flash.remove(), 400);
                    }
                });
            }
        });

        // Add custom styles for flash
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes figmaFlash {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    });
})();
