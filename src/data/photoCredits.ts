import type { TableName } from '../types/content';

// Author/license of each stock photo in public/images/stock/, all taken from
// Wikimedia Commons. Most are CC BY-SA, which requires crediting the author:
// they're listed on the /creditos page. When you replace a photo with your
// own, delete its entry here.
export interface PhotoCredit {
  table: TableName;
  id: string;
  file: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  source: string;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    table: 'usados',
    id: 'toyota-corolla-2021',
    file: '2020 Toyota Corolla Altis petrol version front.jpg',
    author: 'LuvsMG481',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2020_Toyota_Corolla_Altis_petrol_version_front.jpg',
  },
  {
    table: 'usados',
    id: 'vw-tcross-2022',
    file: 'Volkswagen T-Cross 1X7A0366.jpg',
    author: 'Alexander Migl',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Volkswagen_T-Cross_1X7A0366.jpg',
  },
  {
    table: 'usados',
    id: 'chevrolet-cruze-2020',
    file: '2017 Chevrolet Cruze LT in Arctic Blue Metallic, Front Left.jpg',
    author: 'Elise240SX',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2017_Chevrolet_Cruze_LT_in_Arctic_Blue_Metallic,_Front_Left.jpg',
  },
  {
    table: 'usados',
    id: 'jeep-compass-2020',
    file: '2018 Jeep Compass Latitude 2.4L front 4.20.19.jpg',
    author: 'Kevauto',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2018_Jeep_Compass_Latitude_2.4L_front_4.20.19.jpg',
  },
  {
    table: 'usados',
    id: 'peugeot-208-2022',
    file: '2020 Peugeot 208 Active.jpg',
    author: 'Vauxford',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2020_Peugeot_208_Active.jpg',
  },
  {
    table: 'usados',
    id: 'ford-territory-2023',
    file: 'Ford Territory 003.jpg',
    author: 'Jengtingchen',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Ford_Territory_003.jpg',
  },
  {
    table: 'motos',
    id: 'honda-twister-2022',
    file: 'NATIM1.jpg',
    author: 'NATIM87',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:NATIM1.jpg',
  },
  {
    table: 'motos',
    id: 'yamaha-fz-2021',
    file: '2011 Yamaha Byson 150 (20201105).jpg',
    author: 'オーバードライブ83',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2011_Yamaha_Byson_150_(20201105).jpg',
  },
  {
    table: 'motos',
    id: 'honda-xr150-2023',
    file: 'Honda Tornado.jpg',
    author: 'Alan1997',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Honda_Tornado.jpg',
  },
  {
    table: 'motos',
    id: 'yamaha-mt03-2021',
    file: 'YAMAHA MT-03 at the Tokyo Motor Show 2015.jpg',
    author: 'PekePON',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:YAMAHA_MT-03_at_the_Tokyo_Motor_Show_2015.jpg',
  },
  {
    table: 'motos',
    id: 'bajaj-ns200-2022',
    file: 'Bj Pulsar NS 200.jpg',
    author: 'EEIM',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bj_Pulsar_NS_200.jpg',
  },
  {
    table: 'motos',
    id: 'kawasaki-z400-2020',
    file: 'Z400 2020.jpg',
    author: 'HeavY913',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Z400_2020.jpg',
  },
  {
    table: 'utilitarios',
    id: 'renault-kangoo-2022',
    file: 'Renault Kangoo Express (46024779345).jpg',
    author: 'Guillaume Vachey from Chalon sur Saone, France',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    source: 'https://commons.wikimedia.org/wiki/File:Renault_Kangoo_Express_(46024779345).jpg',
  },
  {
    table: 'utilitarios',
    id: 'ford-ranger-2020',
    file: 'Ford Ranger XLT 2.5 2019.jpg',
    author: 'RL GNZLZ',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Ford_Ranger_XLT_2.5_2019.jpg',
  },
  {
    table: 'utilitarios',
    id: 'peugeot-partner-2020',
    file: '2024 Peugeot Partner Mk3 DSC 3755.jpg',
    author: 'Alexander Migl',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2024_Peugeot_Partner_Mk3_DSC_3755.jpg',
  },
  {
    table: 'utilitarios',
    id: 'toyota-hilux-2021',
    file: 'Toyota HiLux GR Sport 1X7A7281.jpg',
    author: 'Alexander-93',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Toyota_HiLux_GR_Sport_1X7A7281.jpg',
  },
  {
    table: 'utilitarios',
    id: 'fiat-fiorino-2023',
    file: 'Fiat Qubo Trekking.jpg',
    author: 'RobiNail',
    license: 'Public domain',
    licenseUrl: null,
    source: 'https://commons.wikimedia.org/wiki/File:Fiat_Qubo_Trekking.jpg',
  },
  {
    table: 'utilitarios',
    id: 'vw-amarok-2021',
    file: 'Volkswagen Amarok V6 Extreme 4Motion 2021.jpg',
    author: 'RL GNZLZ',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Volkswagen_Amarok_V6_Extreme_4Motion_2021.jpg',
  },
];
