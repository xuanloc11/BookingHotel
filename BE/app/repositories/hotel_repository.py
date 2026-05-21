import json
from pathlib import Path


class HotelRepository:
    def __init__(self, data_file: Path | None = None) -> None:
        root_path = Path(__file__).resolve().parents[3]
        self.data_file = data_file or root_path / 'FE' / 'public' / 'data' / 'hotels_vietnam.json'

    def list_all(self) -> list[dict]:
        with self.data_file.open('r', encoding='utf-8') as file_handle:
            return json.load(file_handle)