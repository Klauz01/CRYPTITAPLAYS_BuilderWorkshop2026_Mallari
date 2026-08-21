module builder_card::builder_card;

use std::string::String;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

use builder_registry::builder_registry::{
    BuilderRegistry,
    claim_builder_number,
};

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

/// Creates the participant's BuilderCard.
///
/// The participant does NOT provide their builder number.
/// The number is automatically claimed from the shared
/// Cryptita Builder Registry during this transaction.
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
    // Claim the next chronological workshop-wide number.
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