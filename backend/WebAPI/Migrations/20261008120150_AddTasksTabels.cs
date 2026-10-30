using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTasksTabels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_task_priorities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_task_priorities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_task_statuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_task_statuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StatusId = table.Column<int>(type: "integer", nullable: false),
                    PriorityId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tbl_tasks_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_tasks_tbl_task_priorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "tbl_task_priorities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_tasks_tbl_task_statuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "tbl_task_statuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_task_priorities_Name",
                table: "tbl_task_priorities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_task_statuses_Name",
                table: "tbl_task_statuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_tasks_PriorityId",
                table: "tbl_tasks",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_tasks_StatusId",
                table: "tbl_tasks",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_tasks_UserId_StatusId",
                table: "tbl_tasks",
                columns: new[] { "UserId", "StatusId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_tasks");

            migrationBuilder.DropTable(
                name: "tbl_task_priorities");

            migrationBuilder.DropTable(
                name: "tbl_task_statuses");
        }
    }
}
