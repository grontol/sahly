import { TokenKind } from "@/tokenizer/token";

export enum Keywords {
    PlaceUi = "pasang",
    Bind = "sebagai",
    Loop = "ulang",
}

export const KEYWORD_MAP: Record<Keywords, TokenKind> = {
    [Keywords.PlaceUi]:  TokenKind.KeywordPlaceUi,
    [Keywords.Bind]: TokenKind.KeywordBind,
    [Keywords.Loop]: TokenKind.KeywordLoop,
}