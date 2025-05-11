import { TokenKind } from "@/tokenizer/token";

export enum Keywords {
    PlaceUi = "pasang",
    Declare = "buat",
    As = "isinya",
    Loop = "ulang",
    Index = "indexnya",
}

export const KEYWORD_MAP: Record<Keywords, TokenKind> = {
    [Keywords.PlaceUi]:  TokenKind.KeywordPlaceUi,
    [Keywords.Declare]: TokenKind.KeywordDeclare,
    [Keywords.As]: TokenKind.KeywordAs,
    [Keywords.Loop]: TokenKind.KeywordLoop,
    [Keywords.Index]: TokenKind.KeywordIndex,
}