module builder_card::builder_card;

use std::string::String;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

public struct BuilderCard has key, store {
    id: UID,
    builder_name: String,
    builder_no: String,
    profession: String,
    program: String,
    country: String,
    specialization: String,
    building_since: String,
    focus: String,
    community: String,
    skills: String,
    issued: String,
    about: String,
    photo_url: String,
}

public fun create_builder_card(
    builder_name: String,
    builder_no: String,
    profession: String,
    program: String,
    country: String,
    specialization: String,
    building_since: String,
    focus: String,
    community: String,
    skills: String,
    issued: String,
    about: String,
    photo_url: String,
    ctx: &mut TxContext,
) {
    let card = BuilderCard {
        id: object::new(ctx),
        builder_name,
        builder_no,
        profession,
        program,
        country,
        specialization,
        building_since,
        focus,
        community,
        skills,
        issued,
        about,
        photo_url,
    };
    transfer::transfer(card, tx_context::sender(ctx));
}

#[test_only]
use sui::test_scenario::{Self as ts};

#[test]
fun test_create_builder_card_fields() {
    let sender = @0xA;
    let mut scenario = ts::begin(sender);

    {
        let ctx = ts::ctx(&mut scenario);
        create_builder_card(
            std::string::utf8(b"Alex Rivera"),
            std::string::utf8(b"BP-042"),
            std::string::utf8(b"Smart Contract Developer"),
            std::string::utf8(b"Cryptita Build & Deploy 2026"),
            std::string::utf8(b"Philippines"),
            std::string::utf8(b"DeFi Protocols"),
            std::string::utf8(b"2024"),
            std::string::utf8(b"Move on Sui"),
            std::string::utf8(b"Cryptita Plays"),
            std::string::utf8(b"Move, Sui, TypeScript, React"),
            std::string::utf8(b"August 2026"),
            std::string::utf8(b"Workshop participant learning Sui Move."),
            std::string::utf8(b"https://example.com/photos/alex.jpg"),
            ctx,
        );
    };

    ts::next_tx(&mut scenario, sender);
    {
        let card = ts::take_from_sender<BuilderCard>(&scenario);
        assert!(card.builder_name == std::string::utf8(b"Alex Rivera"), 0);
        assert!(card.builder_no == std::string::utf8(b"BP-042"), 1);
        assert!(card.profession == std::string::utf8(b"Smart Contract Developer"), 2);
        assert!(card.program == std::string::utf8(b"Cryptita Build & Deploy 2026"), 3);
        assert!(card.country == std::string::utf8(b"Philippines"), 4);
        assert!(card.specialization == std::string::utf8(b"DeFi Protocols"), 5);
        assert!(card.building_since == std::string::utf8(b"2024"), 6);
        assert!(card.focus == std::string::utf8(b"Move on Sui"), 7);
        assert!(card.community == std::string::utf8(b"Cryptita Plays"), 8);
        assert!(card.skills == std::string::utf8(b"Move, Sui, TypeScript, React"), 9);
        assert!(card.issued == std::string::utf8(b"August 2026"), 10);
        assert!(card.about == std::string::utf8(b"Workshop participant learning Sui Move."), 11);
        assert!(card.photo_url == std::string::utf8(b"https://example.com/photos/alex.jpg"), 12);
        ts::return_to_sender(&scenario, card);
    };

    ts::end(scenario);
}

#[test]
fun test_create_builder_card_transferred_to_sender() {
    let sender = @0xB;
    let mut scenario = ts::begin(sender);

    {
        let ctx = ts::ctx(&mut scenario);
        create_builder_card(
            std::string::utf8(b"Alex Rivera"),
            std::string::utf8(b"BP-042"),
            std::string::utf8(b"Smart Contract Developer"),
            std::string::utf8(b"Cryptita Build & Deploy 2026"),
            std::string::utf8(b"Philippines"),
            std::string::utf8(b"DeFi Protocols"),
            std::string::utf8(b"2024"),
            std::string::utf8(b"Move on Sui"),
            std::string::utf8(b"Cryptita Plays"),
            std::string::utf8(b"Move, Sui, TypeScript, React"),
            std::string::utf8(b"August 2026"),
            std::string::utf8(b"Workshop participant learning Sui Move."),
            std::string::utf8(b"https://example.com/photos/alex.jpg"),
            ctx,
        );
    };

    ts::next_tx(&mut scenario, sender);
    {
        assert!(ts::has_most_recent_for_sender<BuilderCard>(&scenario), 0);
        let card = ts::take_from_sender<BuilderCard>(&scenario);
        ts::return_to_sender(&scenario, card);
    };

    ts::end(scenario);
}
