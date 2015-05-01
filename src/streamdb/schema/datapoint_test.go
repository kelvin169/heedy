package schema

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestDatapoint(t *testing.T) {
	sstring, err := NewSchema(`{"type": "string"}`)
	require.NoError(t, err)

	dp := NewDatapoint(sstring)

	dp.Timestamp = 13.234
	dp.Data = "Hello!"

	require.Equal(t, int64(13234000000), dp.IntTimestamp())

	val, err := dp.DataBytes()
	require.NoError(t, err)

	dp2, err := LoadDatapoint(sstring, dp.IntTimestamp(), val, "sender", "stream")
	require.NoError(t, err)

	if dp2.Data.(string) != "Hello!" || dp2.Timestamp != 13.234 || dp2.Sender != "sender" || dp2.Stream != "stream" {
		t.Errorf("Datapoint loaded incorrectly: %v", dp2)
		return
	}

	require.Contains(t, dp2.String(), "sender")

}
