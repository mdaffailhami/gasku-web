const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const modal = new bootstrap.Modal(document.getElementById('modal'), {});
const konten = document.getElementById('konten');
const tombolKonfirmasi = document.getElementById('tombol-konfirmasi');
const loading = document.getElementById('loading');

let nik = params['nik'];
let key = params['key'];

function getLastMonday() {
  const currDate = new Date();
  const daysDiff = currDate.getDay() - 1;

  const lastMonday = new Date();
  lastMonday.setDate(
    currDate.getDate() - (daysDiff > 0 ? daysDiff : daysDiff * -6)
  );

  return lastMonday;
}

async function konfirmasiETiket() {
  // Start loading
  loading.classList.remove('d-none');

  const lastMonday = getLastMonday();
  const hariKe = lastMonday.getDate();
  const bulan = lastMonday.getMonth();
  const tahun = lastMonday.getFullYear();
  const eTiketID = `${hariKe}-${bulan}-${tahun}`;

  const url = `https://gasku-kmipn-default-rtdb.asia-southeast1.firebasedatabase.app/users/${nik}/riwayatETiket/${eTiketID}.json`;

  try {
    if (key != CryptoJS.SHA1(`${nik}(${eTiketID})`).toString()) {
      throw 'Wrong key';
    }
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: eTiketID,
        tanggal: {
          hariKe: hariKe,
          bulan: bulan,
          tahun: tahun,
        },
      }),
    });

    alert('Konfirmasi Pengambilan Gas Berhasil');
  } catch (error) {
    console.log('Error:', error);
  }

  // Stop loading
  loading.classList.add('d-none');
}

async function initial() {
  modal.toggle();
  tombolKonfirmasi.addEventListener('click', () => konfirmasiETiket());

  const url = `https://gasku-kmipn-default-rtdb.asia-southeast1.firebasedatabase.app/users/${nik}.json`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    konten.innerHTML = `
      <table class="table">
        <tbody>
          <tr>
            <th scope="row">●</th>
            <td>Nama</td>
            <td>:</td>
            <td>${data.nama}</td>
          </tr>
          <tr>
            <th scope="row">●</th>
            <td>NIK</td>
            <td>:</td>
            <td>${data.nik}</td>
          </tr>
          <tr>
            <th scope="row">●</th>
            <td>KK</td>
            <td>:</td>
            <td>${data.kk}</td>
          </tr>
          <tr>
            <th scope="row">●</th>
            <td>No. Telepon</td>
            <td>:</td>
            <td>${data.noTelepon}</td>
          </tr>
        </tbody>
      </table>
    `;
  } catch (error) {
    konten.innerHTML = '<h5>Data tidak ditemukan</h5>';
    console.log('Error:', error);
  }
}

initial();
