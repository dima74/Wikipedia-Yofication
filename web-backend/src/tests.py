import unittest
from src.yofication import yoficate_text


class TestCase(unittest.TestCase):
    def yofication(self, text, expected):
        yoficated_text, _ = yoficate_text(text)
        self.assertEqual(yoficated_text, expected)

    def noyofication(self, text):
        self.yofication(text, text)

    def test_basic(self):
        self.yofication('зеленый', 'зелёный')
        self.yofication('при нем был', 'при нём был')

    def test_abbreviation(self):
        self.noyofication('нем.')
        self.yofication('зеленый.', 'зелёный.')

    def test_after_link(self):
        self.noyofication('[[верхн]]ее')
        self.noyofication('[[верхн]]ее село')

    def test_inside_link(self):
        self.noyofication('[[ее]]')
        self.noyofication('[[ее да ее]]')
        self.noyofication('[[ее|ее]]')
        self.noyofication('[[ ее ]]')

    def test_inside_tags(self):
        self.noyofication('<                 ее  >')
        self.noyofication('[[                ее  ]]')
        self.noyofication('[                 ее  ]')
        self.noyofication('{{                ее  }}')
        self.noyofication('{{начало цитаты   ее  {{конец цитаты')
        self.noyofication('«                 ее  »')
        self.noyofication('<!--              ее  -->')
        self.noyofication('<source           ее  </source')
        self.noyofication('<ref              ее  </ref')
        self.noyofication('<blockquote       ее  </blockquote')

    def test_in_section(self):
        self.noyofication('== литература ==\nее')
        self.noyofication('== ссылки ==\nее')
        self.noyofication('== примечания ==\nее')
        self.noyofication('== сочинения ==\nее')
        self.noyofication('== источники ==\nее')

        self.noyofication('== Источники ==\nее')
        self.noyofication('== ИСТОЧНИКИ ==\nее')
        self.noyofication('==источники==\nее')
        self.noyofication('==   источники   ==\nее')
        self.noyofication('  ==источники==  \nее')


if __name__ == '__main__':
    unittest.main()
