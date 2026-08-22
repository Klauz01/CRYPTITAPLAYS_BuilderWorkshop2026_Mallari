module builder_card::builder_card;

use std::string::{Self, String};
use std::vector;

use sui::display;
use sui::object::{Self, UID};
use sui::package;
use sui::transfer;
use sui::tx_context::{Self, TxContext};

use builder_registry::builder_registry::{
    BuilderRegistry,
    claim_builder_number,
};

/// One-Time Witness used when the package is first published.
public struct BUILDER_CARD has drop {}

/// A self-created on-chain portfolio produced by a participant
/// during the Cryptita Builder Workshop.
public struct BuilderCard has key, store {
    id: UID,

    builder_name: String,

    /// Chronological workshop-wide builder number assigned
    /// automatically by the Cryptita Builder Registry.
    builder_no: u64,

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

/// Runs once when each participant publishes their BuilderCard package.
///
/// Creates Display metadata so explorers and other Sui applications
/// can present BuilderCard as a portfolio instead of only a raw Move object.
fun init(
    otw: BUILDER_CARD,
    ctx: &mut TxContext,
) {
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"creator"),
        string::utf8(b"image_url"),
        string::utf8(b"builder_no"),
        string::utf8(b"profession"),
        string::utf8(b"program"),
        string::utf8(b"country"),
        string::utf8(b"specialization"),
        string::utf8(b"building_since"),
        string::utf8(b"focus"),
        string::utf8(b"community"),
        string::utf8(b"skills"),
        string::utf8(b"issued"),
    ];

    let values = vector[
        string::utf8(b"Cryptita Builder #{builder_no} — {builder_name}"),

        string::utf8(
            b"Self-created Proof of Learning & Building portfolio produced during the Cryptita Builder Workshop. This on-chain BuilderCard records the participant's workshop portfolio and builder number."
        ),

        string::utf8(b"{builder_name}"),

        string::utf8(b"{photo_url}"),

        string::utf8(b"{builder_no}"),

        string::utf8(b"{profession}"),

        string::utf8(b"{program}"),

        string::utf8(b"{country}"),

        string::utf8(b"{specialization}"),

        string::utf8(b"{building_since}"),

        string::utf8(b"{focus}"),

        string::utf8(b"{community}"),

        string::utf8(b"{skills}"),

        string::utf8(b"{issued}"),
    ];

    let mut display = display::new_with_fields<BuilderCard>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(
        publisher,
        tx_context::sender(ctx),
    );

    transfer::public_transfer(
        display,
        tx_context::sender(ctx),
    );
}

/// Creates the participant's BuilderCard.
///
/// Builder number is automatically claimed from the shared
/// Cryptita Builder Registry.
#[allow(lint(self_transfer))]
public fun create_builder_card(
    registry: &mut BuilderRegistry,
    builder_name: String,
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
    let builder_no = claim_builder_number(registry);

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

    transfer::transfer(
        card,
        tx_context::sender(ctx),
    );
}