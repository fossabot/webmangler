import type { TestScenarios } from "@webmangler/testing";
import type { CharSet } from "@webmangler/types";

import { expect } from "chai";

import NameGenerator from "../name-generator.class";

interface TestCase {
  charSet?: CharSet;
  reserved?: string[];
  samples: {
    inc: number;
    expected: string;
  }[];
}

const ALL_LOWERCASE_CHARS: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
];

const ALL_NUMBER_CHARS: CharSet = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

const ALL_UPPERCASE_CHARS: CharSet = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

suite("NameGenerator", function() {
  const defaultCharsetArray = [
    ...ALL_LOWERCASE_CHARS,
    ...ALL_UPPERCASE_CHARS,
    ...ALL_NUMBER_CHARS,
  ];

  const allLowercaseCharsArray = Array.from(ALL_LOWERCASE_CHARS);
  const allNumberCharsArray = Array.from(ALL_NUMBER_CHARS);
  const allUppercaseCharsArray = Array.from(ALL_UPPERCASE_CHARS);

  const reservedScenarios: TestScenarios<TestCase[]> = [
    {
      testName: "no reserved",
      getScenario: () => [
        {
          samples: [
            ...defaultCharsetArray.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: 0, expected: "ab" },
            { inc: defaultCharsetArray.length - 3, expected: "a9" },
            { inc: 0, expected: "ba" },
          ],
        },
        {
          samples: [
            { inc: defaultCharsetArray.length**2, expected: "9a" },
            { inc: defaultCharsetArray.length - 2, expected: "99" },
            { inc: 0, expected: "aaa" },
            { inc: 0, expected: "aab" },
          ],
        },
        {
          charSet: [...allLowercaseCharsArray, ...allUppercaseCharsArray],
          samples: [
            ...allLowercaseCharsArray.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...allUppercaseCharsArray.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: allLowercaseCharsArray.length - 1, expected: "aA" },
            { inc: 0, expected: "aB" },
            { inc: allUppercaseCharsArray.length - 2, expected: "ba" },
            { inc: allLowercaseCharsArray.length - 1, expected: "bA" },
          ],
        },
        {
          charSet: [...allLowercaseCharsArray, ...allNumberCharsArray],
          samples: [
            ...allLowercaseCharsArray.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...allNumberCharsArray.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: allLowercaseCharsArray.length - 1, expected: "a0" },
            { inc: 1, expected: "a2" },
            { inc: allNumberCharsArray.length - 3, expected: "ba" },
            { inc: allLowercaseCharsArray.length - 1, expected: "b0" },
          ],
        },
      ],
    },
    {
      testName: "reserved strings",
      getScenario: () => [
        {
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: defaultCharsetArray.length - 2, expected: "aa" },
          ],
        },
        {
          reserved: ["a", "b", "ab"],
          samples: [
            { inc: 0, expected: "c" },
            { inc: defaultCharsetArray.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          charSet: allLowercaseCharsArray,
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: allLowercaseCharsArray.length - 2, expected: "aa" },
          ],
        },
        {
          charSet: allUppercaseCharsArray,
          reserved: ["B"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: allUppercaseCharsArray.length - 2, expected: "AB" },
          ],
        },
        {
          charSet: allNumberCharsArray,
          reserved: ["3", "1", "4"],
          samples: [
            { inc: 2, expected: "5" },
            { inc: allNumberCharsArray.length - 5, expected: "01" },
          ],
        },
      ],
    },
    {
      testName: "reserved patterns",
      getScenario: () => [
        {
          reserved: ["a.*"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: defaultCharsetArray.length - 2, expected: "ba" },
          ],
        },
        {
          reserved: [".*b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "c" },
            { inc: defaultCharsetArray.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          reserved: ["a.", ".c"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: 0, expected: "c" },
            { inc: defaultCharsetArray.length - 3, expected: "ba" },
            { inc: 1, expected: "bd" },
          ],
        },
        {
          charSet: allNumberCharsArray,
          reserved: ["0.*"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: allNumberCharsArray.length - 2, expected: "10" },
          ],
        },
        {
          charSet: allUppercaseCharsArray,
          reserved: [".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: allUppercaseCharsArray.length - 2, expected: "AC" },
            { inc: allUppercaseCharsArray.length - 3, expected: "CA" },
          ],
        },
        {
          charSet: [...allLowercaseCharsArray, ...allUppercaseCharsArray],
          reserved: ["[b-d]", "[D-G]"],
          samples: [
            { inc: 1, expected: "e" },
            { inc: allLowercaseCharsArray.length - 3, expected: "C" },
            { inc: 0, expected: "H" },
          ],
        },
      ],
    },
    {
      testName: "reserved strings & patterns",
      getScenario: () => [
        {
          reserved: ["a.*", "c"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: 0, expected: "d" },
            { inc: defaultCharsetArray.length - 4, expected: "ba" },
            { inc: 1, expected: "bc" },
          ],
        },
        {
          reserved: ["c", ".+b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: defaultCharsetArray.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
            { inc: defaultCharsetArray.length - 2, expected: "bc" },
          ],
        },
        {
          charSet: allNumberCharsArray,
          reserved: ["0.*", "2"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: 0, expected: "3" },
            { inc: allNumberCharsArray.length - 4, expected: "10" },
          ],
        },
        {
          charSet: allUppercaseCharsArray,
          reserved: ["E", ".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: 1, expected: "F" },
            { inc: allUppercaseCharsArray.length - 5, expected: "AC" },
            { inc: allUppercaseCharsArray.length - 3, expected: "CA" },
          ],
        },
      ],
    },
    {
      testName: "duplicate characters",
      getScenario: () => [
        {
          charSet: ["a", "b", "c", "a"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
        {
          charSet: ["a", "b", "c", "b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
        {
          charSet: ["a", "b", "c", "c"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
      ],
    },
  ];

  for (const { getScenario, testName } of reservedScenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const { charSet: _charSet, reserved, samples } = testCase;
        const charSet = _charSet || defaultCharsetArray;
        expect(charSet).to.have.length.above(3);

        const g = new NameGenerator({
          reservedNames: reserved,
          charSet: _charSet,
        });

        for (const { inc, expected } of samples) {
          for (let i = 0; i < inc; i++) {
            g.nextName();
          }

          expect(g.nextName()).to.equal(expected);
        }
      }
    });
  }

  test("empty character set", function() {
    expect(() => {
      new NameGenerator({ charSet: [] });
    }).to.throw("character set cannot be empty");
  });
});
