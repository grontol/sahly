
export function _$$entry(el) {
    let angka = 5;
    angka = 10
    let input1 = (function () {
        const el = document.createElement('input');
        el.placeholder = "Masukkan angka 1";
        return el;
    })();
    let input2 = (function () {
        const el = document.createElement('input');
        el.placeholder = "Masukkan angka 2";
        return el;
    })();
    el.appendChild(input1);
    el.appendChild(input2);
    el.appendChild((function () {
        const el = document.createElement('button');
        el.textContent = "Tambahkan";
        el.onclick = () => { };
        return el;
    })());

    for (let i = 0; i < angka; i++) {

        for (let j = 0; j < 4; j++) {
            el.appendChild((function () {
                const el = document.createElement('div');
                el.innerHTML = ((i + 1) * (j + 1));
                return el;
            })());
        }

    }

}
